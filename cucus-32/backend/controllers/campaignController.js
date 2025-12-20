const Campaign = require("../models/campaign");

// Rastgele kısa kod üretme fonksiyonu (6 karakterli)
const generateShortCode = async () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    let isUnique = false;

    while (!isUnique) {
        code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Veritabanında var mı kontrol et
        const existing = await Campaign.findOne({ couponCode: code });
        if (!existing) {
            isUnique = true;
        }
    }
    return code;
};

// Kampanya Oluşturma (Sadece Admin)
exports.createCampaign = async (req, res) => {
    try {
        const { title, description, discountType, discountValue, startDate, endDate, isActive, image, couponCode } = req.body;

        if (!title || !discountValue || !endDate) {
            return res.status(400).json({ message: "Başlık, indirim değeri ve bitiş tarihi zorunludur!" });
        }

        // Eğer kupon kodu gelmediyse, otomatik oluştur
        let finalCouponCode = couponCode;
        if (!finalCouponCode) {
            finalCouponCode = await generateShortCode();
        } else {
            // Eğer geldiyse, benzersiz mi kontrol et
            const existing = await Campaign.findOne({ couponCode: finalCouponCode });
            if (existing) {
                return res.status(400).json({ message: "Bu kampanya kodu zaten kullanılıyor!" });
            }
        }

        const newCampaign = await Campaign.create({
            title,
            description,
            discountType,
            discountValue,
            startDate,
            endDate,
            isActive,
            image,
            couponCode: finalCouponCode
        });

        return res.status(201).json({
            message: "Kampanya başarıyla oluşturuldu!",
            campaign: newCampaign,
        });
    } catch (err) {
        console.log("Create Campaign Error:", err);
        return res.status(500).json({ message: "Sunucu hatası!" });
    }
};

// Tüm Kampanyaları Listeleme (Herkes veya Admin)
exports.getAllCampaigns = async (req, res) => {
    try {
        // İsteğe bağlı: Sadece aktif olanları filtrelemek için query parametresi kullanılabilir ?active=true
        let filter = {};
        if (req.query.active === 'true') {
            filter.isActive = true;
            filter.endDate = { $gte: new Date() }; // Süresi dolmamış olanlar
        }

        const campaigns = await Campaign.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({
            count: campaigns.length,
            campaigns,
        });
    } catch (err) {
        console.log("Get Campaigns Error:", err);
        return res.status(500).json({ message: "Sunucu hatası!" });
    }
};

// Tek Kampanya Getir
exports.getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: "Kampanya bulunamadı!" });
        }
        return res.status(200).json(campaign);
    } catch (err) {
        return res.status(500).json({ message: "Sunucu hatası!" });
    }
};

// Kampanya Güncelleme (Sadece Admin)
exports.updateCampaign = async (req, res) => {
    try {
        const updatedCampaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedCampaign) {
            return res.status(404).json({ message: "Kampanya bulunamadı!" });
        }

        return res.status(200).json({
            message: "Kampanya güncellendi!",
            campaign: updatedCampaign,
        });
    } catch (err) {
        return res.status(500).json({ message: "Sunucu hatası!" });
    }
};

// Kampanya Silme (Sadece Admin)
exports.deleteCampaign = async (req, res) => {
    try {
        const deletedCampaign = await Campaign.findByIdAndDelete(req.params.id);

        if (!deletedCampaign) {
            return res.status(404).json({ message: "Kampanya bulunamadı!" });
        }

        return res.status(200).json({ message: "Kampanya silindi!" });
    } catch (err) {
        return res.status(500).json({ message: "Sunucu hatası!" });
    }
};

// Kampanya durumunu değiştirme (Aktif/Pasif) (Sadece Admin)
exports.toggleCampaignStatus = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: "Kampanya bulunamadı!" });
        }

        // Durumu tersine çevir
        campaign.isActive = !campaign.isActive;
        await campaign.save();

        return res.status(200).json({
            message: `Kampanya ${campaign.isActive ? 'aktif' : 'pasif'} hale getirildi!`,
            campaign,
        });
    } catch (err) {
        return res.status(500).json({ message: "Sunucu hatası!" });
    }
};

// --- YENİ EKLENEN FONKSİYONLAR ---

// Kod Doğrulama (Kullanıcı için)
exports.validateCampaignCode = async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user.id;

        if (!code) {
            return res.status(400).json({ message: "Kod gerekli!" });
        }

        const campaign = await Campaign.findOne({ couponCode: code });

        if (!campaign) {
            return res.status(404).json({ valid: false, message: "Kupon bulunamadı!" });
        }

        if (!campaign.isActive) {
            return res.status(400).json({ valid: false, message: "Bu kampanya aktif değil!" });
        }

        if (new Date(campaign.endDate) < new Date()) {
            return res.status(400).json({ valid: false, message: "Kuponun süresi dolmuş!" });
        }

        // Kullanıcı daha önce kullanmış mı?
        const isUsed = campaign.usedBy.includes(userId);
        if (isUsed) {
            return res.status(400).json({ valid: false, message: "Bu kuponu zaten kullandınız!" });
        }

        return res.status(200).json({
            valid: true,
            message: "Kupon geçerli!",
            discountType: campaign.discountType,
            discountValue: campaign.discountValue,
            campaignTitle: campaign.title
        });

    } catch (err) {
        console.error("Validate Campaign Code Error:", err);
        return res.status(500).json({ message: "Sunucu hatası!" });
    }
};

// Kodu Kullandı Olarak İşaretle (Genelde Order create içinde çağrılacak ama endpoint de dursun)
exports.applyCampaignCode = async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user.id; // Auth middleware'den gelir

        const campaign = await Campaign.findOne({ couponCode: code });
        if (!campaign) {
            return res.status(404).json({ message: "Kampanya bulunamadı" });
        }

        // Tekrar kontrol
        if (new Date(campaign.endDate) < new Date()) {
            return res.status(400).json({ message: "Süresi dolmuş!" });
        }

        if (campaign.usedBy.includes(userId)) {
            return res.status(400).json({ message: "Zaten kullanılmış!" });
        }

        campaign.usedBy.push(userId);
        await campaign.save();

        return res.status(200).json({ message: "Kupon başarıyla uygulandı!" });

    } catch (err) {
        return res.status(500).json({ message: "Sunucu hatası!" });
    }
};
