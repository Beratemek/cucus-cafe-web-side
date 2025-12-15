const Campaign = require("../models/campaign");

// Kampanya Oluşturma (Sadece Admin)
exports.createCampaign = async (req, res) => {
    try {
        const { title, description, discountType, discountValue, startDate, endDate, isActive, image } = req.body;

        if (!title || !discountValue || !endDate) {
            return res.status(400).json({ message: "Başlık, indirim değeri ve bitiş tarihi zorunludur!" });
        }

        const newCampaign = await Campaign.create({
            title,
            description,
            discountType,
            discountValue,
            startDate,
            endDate,
            isActive,
            image
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
