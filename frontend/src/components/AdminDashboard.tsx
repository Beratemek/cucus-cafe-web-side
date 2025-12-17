import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  LogOut, Users, Coffee, ShoppingCart, Edit, Trash2, Plus, 
  Package, Home, Search, X, Tag, Receipt, Cake, Flame, Snowflake, 
  IceCream, Apple, GlassWater, UtensilsCrossed, Wine, Sparkles,
  ToggleLeft, ToggleRight, Layers, FolderEdit, AlertTriangle,
  Pizza, Sandwich, Cookie, Beer, CupSoda, Croissant, Drumstick
} from 'lucide-react';
import { API_URL } from '../config';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

interface ProductSize {
  size: string;
  price: number;
}

interface OrderItem {
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface Customer {
  id: string;
  loyaltyNumber: string;
  name: string;
  email: string;
  points: number;
  totalOrders: number;
}

interface Order {
  id: string;
  customerName: string;
  loyaltyNumber: string;
  items: OrderItem[];
  totalAmount: number;
  pointsUsed: number;
  pointsEarned: number;
  couponCode: string;
  status: 'Completed' | 'Cancelled';
  date: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  sizes: ProductSize[];
  description: string;
  createdAt: string;
  tag?: string;
  image?: string; 
  price?: number; 
}

interface Campaign {
  _id: string;
  title: string;
  description: string;
  discountType: 'percent' | 'amount';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  couponCode?: string; // Optional campaign coupon code
}

// İKON LİSTESİ
const AVAILABLE_ICONS = [
  { id: 'Coffee', icon: Coffee, label: 'Kahve' },
  { id: 'Cake', icon: Cake, label: 'Pasta' },
  { id: 'Sparkles', icon: Sparkles, label: 'Özel' },
  { id: 'Flame', icon: Flame, label: 'Sıcak' },
  { id: 'Snowflake', icon: Snowflake, label: 'Soğuk/Buzlu' },
  { id: 'IceCream', icon: IceCream, label: 'Dondurma' },
  { id: 'Apple', icon: Apple, label: 'Meyve/Smoothie' },
  { id: 'GlassWater', icon: GlassWater, label: 'İçecek' },
  { id: 'UtensilsCrossed', icon: UtensilsCrossed, label: 'Yemek' },
  { id: 'Wine', icon: Wine, label: 'Kokteyl' },
  { id: 'Pizza', icon: Pizza, label: 'Pizza' },
  { id: 'Sandwich', icon: Sandwich, label: 'Sandviç' },
  { id: 'Cookie', icon: Cookie, label: 'Kurabiye' },
  { id: 'Beer', icon: Beer, label: 'Bira' },
  { id: 'CupSoda', icon: CupSoda, label: 'Kola/Gazoz' },
  { id: 'Croissant', icon: Croissant, label: 'Kruvasan' },
  { id: 'Drumstick', icon: Drumstick, label: 'Atıştırmalık' },
  { id: 'Package', icon: Package, label: 'Diğer' },
];

export function AdminDashboard({ onLogout, onNavigateHome }: AdminDashboardProps) {

  const [newProductImage, setNewProductImage] = useState('');
  const [activeTab, setActiveTab] = useState('create-order');
  const [selectedCategory, setSelectedCategory] = useState('standard-coffee');
  
  // Sipariş Oluşturma State'leri
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loyaltyNumber, setLoyaltyNumber] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discountType: 'percent' | 'amount', discountValue: number} | null>(null);
  const [couponError, setCouponError] = useState('');
  const [pointsToUse, setPointsToUse] = useState(0);
  const [customerInfo, setCustomerInfo] = useState<Customer | null>(null);
  
  // Modallar
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  
  // Kampanya Form State'leri
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampDesc, setNewCampDesc] = useState('');
  const [newCampType, setNewCampType] = useState<'percent' | 'amount'>('percent');
  const [newCampValue, setNewCampValue] = useState(0);
  const [newCampStartDate, setNewCampStartDate] = useState('');
  const [newCampEndDate, setNewCampEndDate] = useState('');
  const [newCampActive, setNewCampActive] = useState(true);
  const [newCampCoupon, setNewCampCoupon] = useState(''); // Campaign coupon code

  // Kategori Yönetim State'leri
  const [showCategoryModal, setShowCategoryModal] = useState(false); 
  const [newCatName, setNewCatName] = useState(''); 
  const [newCatIcon, setNewCatIcon] = useState('Package'); 
  const [editingCategory, setEditingCategory] = useState<{oldName: string, newName: string, displayName: string} | null>(null); 

  // Filtreleme State'leri
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  
  // Product form states
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('standard-coffee');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductTag, setNewProductTag] = useState('');
  const [newProductSizes, setNewProductSizes] = useState<ProductSize[]>([]);
  const [tempSize, setTempSize] = useState('');
  const [tempPrice, setTempPrice] = useState('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Veri Stateleri
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  // --- DİNAMİK KATEGORİ VE İKON SİSTEMİ ---
  
  const [customCategoryConfig, setCustomCategoryConfig] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('customCategoryConfig');
    return saved ? JSON.parse(saved) : {};
  });

  const defaultIconMap: Record<string, any> = {
    'standard-coffee': Coffee, 'cakes': Cake, 'special-coffee': Sparkles, 'hot-beverages': Flame,
    'iced-coffees': Snowflake, 'frappe': IceCream, 'milkshake': IceCream, 'frozen': Snowflake,
    'smoothie': Apple, 'cold-drinks': GlassWater, 'sandwich': UtensilsCrossed, 'cocktail': Wine,
  };

  const getIconComponent = (iconName: string) => {
    const found = AVAILABLE_ICONS.find(i => i.id === iconName);
    return found ? found.icon : Package;
  };

  const uniqueProductCategories = Array.from(new Set(products.map(p => p.category)));
  const manuallyAddedCategories = Object.keys(customCategoryConfig); 
  
  const allCategoryKeys = Array.from(new Set([
    'standard-coffee', 'cakes', 
    ...uniqueProductCategories, 
    ...manuallyAddedCategories
  ]));

  const dynamicCategories = allCategoryKeys.map(catKey => {
    let IconComponent = Package;
    if (customCategoryConfig[catKey]) {
      IconComponent = getIconComponent(customCategoryConfig[catKey]);
    } else if (defaultIconMap[catKey]) {
      IconComponent = defaultIconMap[catKey];
    }

    return {
      id: catKey,
      name: catKey.charAt(0).toUpperCase() + catKey.slice(1).replace(/-/g, ' '), 
      icon: IconComponent,
      count: products.filter(p => p.category === catKey).length
    };
  });

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    onLogout();
  };

  // --- API FONKSİYONLARI ---
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`); 
      const data = await response.json();
      if (response.ok) {
        const mappedProducts = data.products.map((p: any) => ({
          id: p._id, name: p.name, category: p.category, description: p.description,
          sizes: p.sizes || [], price: 0, createdAt: new Date(p.createdAt).toLocaleDateString('tr-TR'),
          tag: p.tag || '', image: p.image || ''
        }));
        setProducts(mappedProducts);
      }
    } catch (error) { console.error("Bağlantı hatası:", error); }
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await response.json();
        if (response.ok) {
          const mappedCustomers = data.users.map((u: any) => ({
            id: u._id, name: `${u.name} ${u.surname}`, email: u.email,
            loyaltyNumber: u.loyalty?.sadakat_no || 'Yok', points: u.loyalty?.points || 0, totalOrders: 0 
          }));
          setCustomers(mappedCustomers);
        }
      } catch (error) { console.error("Sunucu hatası:", error); }
    };
    fetchCustomers();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${API_URL}/campaigns`);
      const data = await response.json();
      if (response.ok) setCampaigns(data.campaigns);
    } catch (error) { console.error("Kampanyalar çekilemedi:", error); }
  };

  useEffect(() => { if (activeTab === 'campaigns') fetchCampaigns(); }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await response.json();
      if (response.ok) {
        const mappedOrders = data.orders.map((o: any) => ({
          id: o._id, customerName: o.user ? `${o.user.name} ${o.user.surname}` : 'Bilinmeyen Müşteri',
          loyaltyNumber: o.user?.loyalty?.sadakat_no || '-', items: o.items.map((i: any) => ({
            productId: i.product?._id, name: i.product?.name || 'Silinmiş Ürün', size: i.selectedSize || 'Standart', price: i.price, quantity: i.quantity
          })),
          totalAmount: o.totalAmount, pointsUsed: o.pointsUsed, pointsEarned: o.pointsEarned, couponCode: o.couponCode || '',
          status: o.status === 'İptal Edildi' ? 'Cancelled' : 'Completed', date: new Date(o.createdAt).toLocaleString('tr-TR'),
        }));
        setOrdersList(mappedOrders);
      }
    } catch (error) { console.error("Siparişler çekilemedi:", error); }
  };

  useEffect(() => { if (activeTab === 'orders') fetchOrders(); }, [activeTab]);

  // --- KATEGORİ İŞLEMLERİ ---
  const handleAddCategory = () => {
    if (!newCatName) { alert("Lütfen kategori adı giriniz."); return; }
    const catId = newCatName.trim().toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/\s+/g, '-');

    const newConfig = { ...customCategoryConfig, [catId]: newCatIcon };
    setCustomCategoryConfig(newConfig);
    localStorage.setItem('customCategoryConfig', JSON.stringify(newConfig));

    alert(`${newCatName} kategorisi eklendi!`);
    setShowCategoryModal(false);
    setNewCatName('');
    setNewCatIcon('Package');
  };

  const handleDeleteCategory = async (categoryKey: string) => {
    const productsToDelete = products.filter(p => p.category === categoryKey);
    const count = productsToDelete.length;

    if (count === 0) {
      if(!confirm(`"${categoryKey}" adlı boş kategoriyi silmek istiyor musunuz?`)) return;
      const newConfig = { ...customCategoryConfig };
      delete newConfig[categoryKey];
      setCustomCategoryConfig(newConfig);
      localStorage.setItem('customCategoryConfig', JSON.stringify(newConfig));
      alert("Kategori silindi.");
      return;
    }

    const confirmMsg = `DİKKAT: "${categoryKey}" kategorisini silmek üzeresiniz.\n\nBu işlem, bu kategoriye ait ${count} adet ürünü de kalıcı olarak SİLECEKTİR.\n\nOnaylıyor musunuz?`;
    if (!confirm(confirmMsg)) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const deletePromises = productsToDelete.map(product => 
        fetch(`${API_URL}/products/${product.id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        })
      );
      await Promise.all(deletePromises);

      const newConfig = { ...customCategoryConfig };
      delete newConfig[categoryKey];
      setCustomCategoryConfig(newConfig);
      localStorage.setItem('customCategoryConfig', JSON.stringify(newConfig));

      alert(`${count} ürün ve kategori başarıyla silindi.`);
      fetchProducts();

    } catch (error) {
      console.error("Kategori silme hatası:", error);
      alert("Bir hata oluştu.");
    }
  };

  const handleRenameCategory = async () => {
    if (!editingCategory || !editingCategory.newName) return;
    const formattedNewName = editingCategory.newName.trim().toLowerCase().replace(/\s+/g, '-');

    if (formattedNewName === editingCategory.oldName) { setEditingCategory(null); return; }

    const confirmMsg = `"${editingCategory.oldName}" kategorisindeki TÜM ÜRÜNLER "${formattedNewName}" kategorisine taşınacak. Onaylıyor musunuz?`;
    if (!confirm(confirmMsg)) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const productsToUpdate = products.filter(p => p.category === editingCategory.oldName);
      const updatePromises = productsToUpdate.map(product => 
        fetch(`${API_URL}/products/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ ...product, category: formattedNewName })
        })
      );
      await Promise.all(updatePromises);

      const newConfig = { ...customCategoryConfig };
      if (newConfig[editingCategory.oldName]) {
        newConfig[formattedNewName] = newConfig[editingCategory.oldName]; 
        delete newConfig[editingCategory.oldName]; 
      } else {
        newConfig[formattedNewName] = 'Package';
      }
      setCustomCategoryConfig(newConfig);
      localStorage.setItem('customCategoryConfig', JSON.stringify(newConfig));

      alert("Kategori ismi ve ürünler güncellendi!");
      fetchProducts();
      setEditingCategory(null);

    } catch (error) {
      console.error("Kategori güncelleme hatası:", error);
      alert("Bir hata oluştu.");
    }
  };

  // --- SİPARİŞ İŞLEMLERİ ---
  const handleValidateCoupon = async () => {
    if (!couponCode || !loyaltyNumber) {
      setCouponError("Önce müşteri seçin ve kupon kodu girin.");
      return;
    }
    setCouponError('');
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/validate-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ loyaltyNo: loyaltyNumber, couponCode })
      });
      const data = await response.json();
      
      if (response.ok && data.valid) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountType: data.coupon.discountType,
          discountValue: data.coupon.discountValue
        });
        setCouponError('');
        alert(`Kupon uygulandı: %${data.coupon.discountType === 'percent' ? data.coupon.discountValue : `₺${data.coupon.discountValue} İndirim`}`);
      } else {
        setAppliedCoupon(null);
        setCouponError(data.message || "Geçersiz kupon.");
      }
    } catch (error) {
      console.error("Kupon doğrulama hatası:", error);
      setCouponError("Sunucu hatası.");
    }
  };

  const createOrder = async () => {
    if (orderItems.length === 0) { alert("Sepet boş!"); return; }
    if (!loyaltyNumber) { alert("Lütfen bir müşteri seçiniz."); return; }
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/create`, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          loyaltyNo: loyaltyNumber, items: orderItems.map(item => ({ product: item.productId, quantity: item.quantity, selectedSize: item.size })),
          pointsUsed: Number(pointsToUse), couponCode: couponCode || undefined
        })
      });
      const result = await response.json();
      if (response.ok) {
        alert(`Sipariş başarıyla oluşturuldu!\nKazanılan Puan: ${result.order.pointsEarned}`);
        setOrderItems([]); setLoyaltyNumber(''); setCouponCode(''); setAppliedCoupon(null); setPointsToUse(0); setCustomerInfo(null); fetchOrders(); 
      } else { alert(`Hata: ${result.message}`); }
    } catch (error) { alert("Sunucu ile bağlantı kurulamadı."); }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Siparişi iptal etmek istediğinize emin misiniz?')) return;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) { alert('Sipariş iptal edildi.'); setShowOrderDetail(false); fetchOrders(); }
    } catch (error) { console.error("İptal hatası:", error); }
  };

  // --- DİĞER HANDLERLAR ---
  const handleCreateCampaign = async () => {
    if (!newCampTitle || !newCampValue || !newCampEndDate) { alert("Zorunlu alanları doldurun."); return; }
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/campaigns`, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ 
          title: newCampTitle, 
          description: newCampDesc, 
          discountType: newCampType, 
          discountValue: Number(newCampValue), 
          startDate: newCampStartDate || new Date(), 
          endDate: newCampEndDate, 
          isActive: newCampActive,
          couponCode: newCampCoupon || undefined // Optional coupon
        })
      });
      if (response.ok) { alert("Kampanya oluşturuldu!"); setShowCampaignModal(false); fetchCampaigns(); setNewCampTitle(''); setNewCampDesc(''); setNewCampValue(0); setNewCampEndDate(''); setNewCampCoupon(''); }
    } catch (error) { console.error(error); }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/campaigns/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
      if (response.ok) { alert("Kampanya silindi."); fetchCampaigns(); }
    } catch (error) { console.error(error); }
  };

  const handleToggleCampaignStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/campaigns/${id}/toggle`, { method: "PATCH", headers: { "Authorization": `Bearer ${token}` } });
      if (response.ok) fetchCampaigns();
    } catch (error) { console.error(error); }
  };

  const addProductSize = () => {
    if (tempSize && tempPrice) { setNewProductSizes([...newProductSizes, { size: tempSize, price: parseFloat(tempPrice) }]); setTempSize(''); setTempPrice(''); }
  };
  const removeProductSize = (index: number) => setNewProductSizes(newProductSizes.filter((_, i) => i !== index));

  const handleAddProduct = async () => {
    if (!newProductName || newProductSizes.length === 0) { alert('Ad ve en az bir Boyut ekleyiniz!'); return; }
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/products`, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: newProductName, category: newProductCategory, description: newProductDescription, sizes: newProductSizes, tag: newProductTag || undefined, image: newProductImage || undefined })
      });
      if (response.ok) { alert('Ürün eklendi!'); fetchProducts(); setShowProductModal(false); setNewProductName(''); setNewProductSizes([]); setNewProductImage(''); setNewProductDescription(''); }
    } catch (error) { console.error("Ekleme hatası:", error); }
  };

  const handleDeleteProduct = async (id: string) => {
    if(!confirm("Ürünü silmek istediğinize emin misiniz?")) return;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/products/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
      if(response.ok) { alert("Ürün silindi."); fetchProducts(); }
    } catch(err) { console.error(err); }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product); setNewProductName(product.name); setNewProductCategory(product.category); setNewProductDescription(product.description);
    setNewProductTag(product.tag || ''); setNewProductSizes([...product.sizes]); setNewProductImage((product as any).image || ''); setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !newProductName || newProductSizes.length === 0) { alert('Eksik bilgi!'); return; }
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/products/${editingProduct.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: newProductName, category: newProductCategory, description: newProductDescription, sizes: newProductSizes, tag: newProductTag || undefined, image: newProductImage || undefined })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Ürün güncellendi!');
        const updatedProduct = data.product;
        const updatedList = products.map(p => p.id === editingProduct.id ? { ...p, name: updatedProduct.name, category: updatedProduct.category, description: updatedProduct.description, sizes: updatedProduct.sizes, tag: updatedProduct.tag, image: updatedProduct.image } : p);
        setProducts(updatedList); setShowEditModal(false); setEditingProduct(null);
      } else { alert("Hata: " + data.message); }
    } catch (error) { console.error("Güncelleme hatası:", error); }
  };

  const handleLoyaltyNumberChange = (value: string) => {
    setLoyaltyNumber(value);
    if (value.length >= 6) { const customer = customers.find(c => c.loyaltyNumber === value); setCustomerInfo(customer || null); } else { setCustomerInfo(null); }
  };

  const addToOrder = (product: Product, selectedSize: ProductSize) => {
    const existingItem = orderItems.find(item => item.productId === product.id && item.size === selectedSize.size);
    if (existingItem) { setOrderItems(orderItems.map(item => item.productId === product.id && item.size === selectedSize.size ? { ...item, quantity: item.quantity + 1 } : item)); }
    else { setOrderItems([...orderItems, { productId: product.id, name: product.name, size: selectedSize.size, price: selectedSize.price, quantity: 1 }]); }
  };

  const removeFromOrder = (productId: string, size: string) => setOrderItems(orderItems.filter(item => !(item.productId === productId && item.size === size)));
  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) removeFromOrder(productId, size); else setOrderItems(orderItems.map(item => item.productId === productId && item.size === size ? { ...item, quantity } : item));
  };

  const calculateSubtotal = () => orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const calculateCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = calculateSubtotal();
    let discount = 0;
    if (appliedCoupon.discountType === 'amount') {
      discount = appliedCoupon.discountValue;
    } else {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
    }
    return Math.min(discount, subtotal);
  };

  const calculateTotal = () => {
    const sub = calculateSubtotal();
    const couponDisc = calculateCouponDiscount();
    return Math.max(0, sub - couponDisc - pointsToUse);
  };

  const calculatePointsToEarn = () => Math.floor(calculateTotal() * 0.1);
  const filteredProducts = products.filter(p => p.category === selectedCategory);
  const getStatusColor = (status: string) => status === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-stone-50">
      <div className="bg-white border-b border-[#E6D3BA] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div><h1 className="text-2xl text-[#2D1B12]">Yönetici Paneli</h1><p className="text-sm text-[#8B5E3C]">CuCu's Coffee & Cake</p></div>
            <div className="flex items-center gap-3"><Button variant="outline" className="border-[#C8A27A] text-[#8B5E3C] hover:bg-[#E6D3BA] rounded-full" onClick={onNavigateHome}><Home className="w-4 h-4 mr-2" /> Anasayfa</Button><Button onClick={handleLogoutClick} variant="outline" className="border-[#C8A27A] text-[#8B5E3C] hover:bg-[#E6D3BA] rounded-full"><LogOut className="w-4 h-4 mr-2" /> Çıkış Yap</Button></div>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-64 bg-white border-r border-[#E6D3BA] min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('create-order')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'create-order' ? 'bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] text-white' : 'text-[#8B5E3C] hover:bg-[#E6D3BA]'}`}><ShoppingCart className="w-5 h-5" /> <span>Sipariş Oluştur</span></button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] text-white' : 'text-[#8B5E3C] hover:bg-[#E6D3BA]'}`}><Receipt className="w-5 h-5" /> <span>Siparişler</span></button>
            <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'products' ? 'bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] text-white' : 'text-[#8B5E3C] hover:bg-[#E6D3BA]'}`}><Package className="w-5 h-5" /> <span>Ürünler</span></button>
            <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'categories' ? 'bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] text-white' : 'text-[#8B5E3C] hover:bg-[#E6D3BA]'}`}><Layers className="w-5 h-5" /> <span>Kategoriler</span></button>
            <button onClick={() => setActiveTab('customers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'customers' ? 'bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] text-white' : 'text-[#8B5E3C] hover:bg-[#E6D3BA]'}`}><Users className="w-5 h-5" /> <span>Müşteriler</span></button>
            <button onClick={() => setActiveTab('campaigns')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'campaigns' ? 'bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] text-white' : 'text-[#8B5E3C] hover:bg-[#E6D3BA]'}`}><Tag className="w-5 h-5" /> <span>Kampanyalar</span></button>
          </nav>
        </div>

        <div className="flex-1 p-6">
          {activeTab === 'create-order' && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-2 space-y-2"><h3 className="text-sm text-[#8B5E3C] mb-3 px-2">Kategoriler</h3>{dynamicCategories.map(cat => (<button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm ${selectedCategory === cat.id ? 'bg-[#8B5E3C] text-white' : 'bg-white text-[#8B5E3C] hover:bg-[#E6D3BA] border border-[#E6D3BA]'}`}><div className="flex items-center gap-2"><cat.icon className="w-4 h-4" /><span>{cat.name}</span></div></button>))}</div>
              <div className="col-span-6"><h3 className="text-sm text-[#8B5E3C] mb-3">Ürünler</h3><div className="grid grid-cols-2 gap-4 max-h-[calc(100vh-200px)] overflow-y-auto">{filteredProducts.map(product => (<div key={product.id} className="bg-white border border-[#E6D3BA] p-4 rounded-2xl hover:shadow-lg transition-all"><h4 className="text-[#2D1B12] mb-1 font-bold">{product.name}</h4><p className="text-xs text-[#8B5E3C] mb-3">{product.description}</p><div className="flex flex-wrap gap-2">{product.sizes.map((sizeOption) => (<button key={sizeOption.size} onClick={() => addToOrder(product, sizeOption)} className="flex-1 min-w-[80px] px-3 py-2 bg-[#E6D3BA] hover:bg-[#8B5E3C] text-[#2D1B12] hover:text-white rounded-xl transition-all text-xs font-bold">{product.sizes.length > 1 && <div>{sizeOption.size}</div>} <div>₺{sizeOption.price}</div></button>))}</div></div>))}</div></div>
              <div className="col-span-4"><div className="bg-white border border-[#E6D3BA] rounded-3xl p-6 sticky top-24"><h3 className="text-xl text-[#2D1B12] mb-4">Sipariş Özeti</h3><div className="mb-4"><label className="text-sm text-[#8B5E3C] mb-2 block">Sadakat Numarası</label><Input value={loyaltyNumber} onChange={(e) => { handleLoyaltyNumberChange(e.target.value); setAppliedCoupon(null); setCouponCode(''); }} placeholder="LOY12345" className="rounded-xl border-[#C8A27A]" />{customerInfo && (<div className="mt-2 p-3 bg-[#E6D3BA] rounded-xl"><p className="text-sm text-[#2D1B12]">Müşteri: <span className="font-bold">{customerInfo.name}</span></p><p className="text-sm text-[#2D1B12]">Mevcut Puan: <span className="font-bold">{customerInfo.points}</span></p></div>)}</div>
              
              <div className="mb-4">
                <label className="text-sm text-[#8B5E3C] mb-2 block">Kupon Kodu</label>
                <div className="flex gap-2">
                  <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="WELCOME10" className="rounded-xl border-[#C8A27A]" disabled={!!appliedCoupon} />
                  {appliedCoupon ? (
                    <Button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl px-3">iptal</Button>
                  ) : (
                    <Button onClick={handleValidateCoupon} className="bg-[#8B5E3C] text-white hover:bg-[#2D1B12] rounded-xl px-4">Uygula</Button>
                  )}
                </div>
                {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                {appliedCoupon && <p className="text-xs text-green-600 mt-1 font-bold">Kupon aktif: {appliedCoupon.discountType === 'percent' ? `%${appliedCoupon.discountValue}` : `₺${appliedCoupon.discountValue}`} indirim</p>}
              </div>
              
              {customerInfo && (<div className="mb-4"><label className="text-sm text-[#8B5E3C] mb-2 block">Kullanılacak Puan</label><Input type="number" value={pointsToUse} onChange={(e) => setPointsToUse(Math.min(Number(e.target.value), customerInfo.points))} max={customerInfo.points} className="rounded-xl border-[#C8A27A]" /></div>)}<div className="mb-4 max-h-48 overflow-y-auto border-t border-[#E6D3BA] pt-4">{orderItems.length === 0 ? (<p className="text-sm text-[#8B5E3C] text-center py-4">Sipariş boş</p>) : (<div className="space-y-2">{orderItems.map((item, index) => (<div key={`${item.productId}-${item.size}-${index}`} className="flex items-center justify-between gap-2 p-2 bg-[#FAF8F5] rounded-xl"><div className="flex-1"><p className="text-sm text-[#2D1B12] font-bold">{item.name}</p><p className="text-xs text-[#8B5E3C]">{item.size} - ₺{item.price}</p></div><div className="flex items-center gap-2"><button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} className="w-6 h-6 bg-[#E6D3BA] rounded-full text-[#2D1B12] hover:bg-[#C8A27A]">-</button><span className="text-sm text-[#2D1B12] w-6 text-center font-bold">{item.quantity}</span><button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} className="w-6 h-6 bg-[#E6D3BA] rounded-full text-[#2D1B12] hover:bg-[#C8A27A]">+</button></div><button onClick={() => removeFromOrder(item.productId, item.size)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button></div>))}</div>)}</div><div className="border-t border-[#E6D3BA] pt-4 space-y-2"><div className="flex justify-between text-sm"><span className="text-[#8B5E3C]">Ara Toplam:</span><span className="text-[#2D1B12] font-bold">₺{calculateSubtotal()}</span></div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B5E3C] flex items-center gap-1"><Tag className="w-3 h-3" /> Kupon İndirimi:</span>
                  <span className="text-green-600 font-bold">-₺{calculateCouponDiscount().toFixed(2)}</span>
                </div>
              )}
              
              {pointsToUse > 0 && (<div className="flex justify-between text-sm"><span className="text-[#8B5E3C]">Puan İndirimi:</span><span className="text-green-600 font-bold">-₺{pointsToUse}</span></div>)}<div className="flex justify-between text-lg border-t border-[#E6D3BA] pt-2"><span className="text-[#2D1B12] font-bold">Toplam:</span><span className="text-[#2D1B12] font-bold">₺{calculateTotal().toFixed(2)}</span></div><div className="flex justify-between text-sm text-green-600"><span>Kazanılacak Puan:</span><span className="font-bold">+{calculatePointsToEarn()} puan</span></div></div><Button onClick={createOrder} disabled={orderItems.length === 0} className="w-full mt-4 bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] text-white hover:from-[#2D1B12] hover:to-[#2D1B12] rounded-xl py-6">Sipariş Oluştur</Button></div></div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between"><h2 className="text-2xl text-[#2D1B12]">Siparişler</h2><div className="flex gap-3"><div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]" /><Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Sipariş ara..." className="pl-10 rounded-xl border-[#C8A27A]" /></div><select value={orderFilter} onChange={(e) => setOrderFilter(e.target.value)} className="px-4 py-2 rounded-xl border border-[#C8A27A] text-[#8B5E3C]"><option value="all">Tüm Siparişler</option><option value="Completed">Tamamlanan</option><option value="Cancelled">İptal Edilen</option></select></div></div>
              <div className="bg-white border border-[#E6D3BA] rounded-3xl overflow-hidden"><table className="w-full"><thead className="bg-[#FAF8F5]"><tr><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Sipariş ID</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Müşteri</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Sadakat No</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Toplam</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Kullanılan Puan</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Kazanılan Puan</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Durum</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Tarih</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">İşlem</th></tr></thead><tbody className="divide-y divide-[#E6D3BA]">{ordersList.filter(order => orderFilter === 'all' || order.status === orderFilter).filter(order => searchTerm === '' || order.id.toLowerCase().startsWith(searchTerm.toLowerCase()) || order.customerName.toLowerCase().startsWith(searchTerm.toLowerCase())).map(order => (<tr key={order.id} className="hover:bg-[#FAF8F5]"><td className="px-6 py-4 text-sm text-[#2D1B12] font-bold">{order.id}</td><td className="px-6 py-4 text-sm text-[#2D1B12]">{order.customerName}</td><td className="px-6 py-4 text-sm text-[#8B5E3C]">{order.loyaltyNumber}</td><td className="px-6 py-4 text-sm text-[#2D1B12] font-bold">₺{order.totalAmount}</td><td className="px-6 py-4 text-sm text-red-600">{order.pointsUsed}</td><td className="px-6 py-4 text-sm text-green-600">{order.pointsEarned}</td><td className="px-6 py-4"><Badge className={getStatusColor(order.status)}>{order.status === 'Completed' ? 'Tamamlandı' : 'İptal'}</Badge></td><td className="px-6 py-4 text-sm text-[#8B5E3C]">{order.date}</td><td className="px-6 py-4"><Button onClick={() => { setSelectedOrder(order); setShowOrderDetail(true); }} variant="outline" className="border-[#C8A27A] text-[#8B5E3C] hover:bg-[#E6D3BA] rounded-xl text-xs">Detay</Button></td></tr>))}</tbody></table></div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between"><h2 className="text-2xl text-[#2D1B12]">Ürünler</h2><div className="flex gap-3"><div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]" /><Input value={productSearchTerm} onChange={(e) => setProductSearchTerm(e.target.value)} placeholder="Ürün ara..." className="pl-10 rounded-xl border-[#C8A27A]" /></div><Button onClick={() => setShowProductModal(true)} className="bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] text-white hover:from-[#2D1B12] hover:to-[#2D1B12] rounded-xl"><Plus className="w-4 h-4 mr-2" /> Ürün Ekle</Button></div></div>
              <div className="bg-white border border-[#E6D3BA] rounded-3xl overflow-hidden"><table className="w-full"><thead className="bg-[#FAF8F5]"><tr><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Ürün Adı</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Kategori</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Fiyat</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Açıklama</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Oluşturulma</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">İşlemler</th></tr></thead><tbody className="divide-y divide-[#E6D3BA]">{products.filter(product => productSearchTerm === '' || product.name.toLowerCase().startsWith(productSearchTerm.toLowerCase())).map(product => (<tr key={product.id} className="hover:bg-[#FAF8F5]"><td className="px-6 py-4 text-sm text-[#2D1B12] font-bold">{product.name}</td><td className="px-6 py-4 text-sm text-[#8B5E3C]">{product.category}</td><td className="px-6 py-4 text-sm text-[#2D1B12] font-bold">{product.sizes.map((s, idx) => (<span key={idx}>{s.size}: ₺{s.price}{idx < product.sizes.length - 1 && ', '}</span>))}</td><td className="px-6 py-4 text-sm text-[#8B5E3C]">{product.description}</td><td className="px-6 py-4 text-sm text-[#8B5E3C]">{product.createdAt}</td><td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => handleEditProduct(product)} className="p-2 text-[#8B5E3C] hover:bg-[#E6D3BA] rounded-lg"><Edit className="w-4 h-4" /></button><button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div></td></tr>))}</tbody></table></div>
            </div>
          )}

          {/* KATEGORİ SEKMESİ (GÜNCELLENDİ) */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-[#2D1B12]">Kategoriler</h2>
                <Button onClick={() => setShowCategoryModal(true)} className="bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] text-white hover:from-[#2D1B12] hover:to-[#2D1B12] rounded-xl">
                  <Plus className="w-4 h-4 mr-2" /> Kategori Ekle
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dynamicCategories.map((cat) => (
                  <div key={cat.id} className="bg-white border border-[#E6D3BA] rounded-2xl p-6 hover:shadow-lg transition-all flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#FAF8F5] rounded-xl text-[#8B5E3C]">
                        <cat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-[#2D1B12] font-bold text-lg">{cat.name}</h4>
                        <p className="text-[#8B5E3C] text-sm">{cat.count} Ürün Mevcut</p>
                        <p className="text-xs text-gray-400 mt-1">ID: {cat.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setEditingCategory({ oldName: cat.id, newName: cat.id, displayName: cat.name })} 
                        className="p-2 text-[#8B5E3C] hover:bg-[#E6D3BA] rounded-lg"
                        title="İsmi Düzenle"
                      >
                        <FolderEdit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Kategoriyi ve Ürünleri Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between"><h2 className="text-2xl text-[#2D1B12]">Müşteriler</h2><div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]" /><Input value={customerSearchTerm} onChange={(e) => setCustomerSearchTerm(e.target.value)} placeholder="Müşteri ara..." className="pl-10 rounded-xl border-[#C8A27A]" /></div></div>
              <div className="bg-white border border-[#E6D3BA] rounded-3xl overflow-hidden"><table className="w-full"><thead className="bg-[#FAF8F5]"><tr><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Müşteri Adı</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Email</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Sadakat No</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Puan</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Toplam Sipariş</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">İşlem</th></tr></thead><tbody className="divide-y divide-[#E6D3BA]">{customers.filter(customer => customerSearchTerm === '' || customer.name.toLowerCase().startsWith(customerSearchTerm.toLowerCase())).map(customer => (<tr key={customer.id} className="hover:bg-[#FAF8F5]"><td className="px-6 py-4 text-sm text-[#2D1B12] font-bold">{customer.name}</td><td className="px-6 py-4 text-sm text-[#8B5E3C]">{customer.email}</td><td className="px-6 py-4 text-sm text-[#8B5E3C]">{customer.loyaltyNumber}</td><td className="px-6 py-4 text-sm text-green-600 font-bold">{customer.points}</td><td className="px-6 py-4 text-sm text-[#2D1B12]">{customer.totalOrders}</td><td className="px-6 py-4"><Button onClick={() => { setSelectedCustomer(customer); setShowCustomerDetail(true); }} variant="outline" className="border-[#C8A27A] text-[#8B5E3C] hover:bg-[#E6D3BA] rounded-xl text-xs">Detay</Button></td></tr>))}</tbody></table></div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between"><h2 className="text-2xl text-[#2D1B12]">Kampanyalar</h2><Button onClick={() => setShowCampaignModal(true)} className="bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] text-white hover:from-[#2D1B12] hover:to-[#2D1B12] rounded-xl"><Plus className="w-4 h-4 mr-2" /> Kampanya Ekle</Button></div>
              <div className="bg-white border border-[#E6D3BA] rounded-3xl overflow-hidden"><table className="w-full"><thead className="bg-[#FAF8F5]"><tr><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Kampanya Adı</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">İndirim Tipi</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">İndirim Değeri</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Başlangıç</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Bitiş</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">Durum</th><th className="px-6 py-4 text-left text-sm text-[#8B5E3C]">İşlemler</th></tr></thead><tbody className="divide-y divide-[#E6D3BA]">{campaigns.map(campaign => (<tr key={campaign._id} className="hover:bg-[#FAF8F5]"><td className="px-6 py-4 text-sm text-[#2D1B12] font-bold">{campaign.title}</td><td className="px-6 py-4 text-sm text-[#8B5E3C]">{campaign.discountType === 'percent' ? 'Yüzde' : 'Sabit Tutar'}</td><td className="px-6 py-4 text-sm text-[#2D1B12] font-bold">{campaign.discountType === 'percent' ? `%${campaign.discountValue}` : `₺${campaign.discountValue}`}</td><td className="px-6 py-4 text-sm text-[#8B5E3C]">{new Date(campaign.startDate).toLocaleDateString('tr-TR')}</td><td className="px-6 py-4 text-sm text-[#8B5E3C]">{new Date(campaign.endDate).toLocaleDateString('tr-TR')}</td><td className="px-6 py-4"><Badge className={campaign.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>{campaign.isActive ? 'Aktif' : 'Pasif'}</Badge></td><td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => handleToggleCampaignStatus(campaign._id)} className="p-2 text-[#8B5E3C] hover:bg-[#E6D3BA] rounded-lg" title={campaign.isActive ? 'Pasifleştir' : 'Aktifleştir'}>{campaign.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}</button><button onClick={() => handleDeleteCampaign(campaign._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div></td></tr>))}</tbody></table></div>
            </div>
          )}
        </div>
      </div>

      {/* Category Rename Modal (GÜNCELLENDİ) */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl text-[#2D1B12] font-bold">Kategori İsmini Düzenle</h3>
            
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-800 space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5" />
                <span className="font-bold">Önemli Bilgi</span>
              </div>
              <p>Mevcut Kategori ID: <strong>{editingCategory.oldName}</strong></p>
              <p>Yeni isim verdiğinizde, bu kategoriye ait tüm ürünler otomatik olarak yeni kategoriye taşınacaktır.</p>
            </div>

            <div>
              <label className="block text-sm text-[#8B5E3C] mb-2">Yeni Kategori İsmi</label>
              <Input 
                value={editingCategory.newName} 
                onChange={(e) => setEditingCategory({...editingCategory, newName: e.target.value})} 
                className="rounded-xl border-[#C8A27A]" 
                placeholder="Örn: Sıcak Çikolatalar"
              />
              <p className="text-xs text-gray-400 mt-1 ml-1">
                Sistem ID'si otomatik oluşturulacak: {editingCategory.newName.trim().toLowerCase().replace(/\s+/g, '-')}
              </p>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button onClick={handleRenameCategory} className="flex-1 bg-[#8B5E3C] text-white hover:bg-[#2D1B12] rounded-xl">Kaydet</Button>
              <Button onClick={() => setEditingCategory(null)} variant="outline" className="flex-1 border-[#C8A27A] text-[#8B5E3C] hover:bg-[#E6D3BA] rounded-xl">İptal</Button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CATEGORY MODAL (YENİ - DARALTILMIŞ) */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6D3BA] pb-4">
              <h3 className="text-xl text-[#2D1B12] font-bold">Yeni Kategori Ekle</h3>
              <button onClick={() => setShowCategoryModal(false)}><X className="w-6 h-6 text-[#8B5E3C]" /></button>
            </div>

            <div>
              <label className="block text-sm text-[#8B5E3C] mb-2">Kategori Adı</label>
              <Input 
                value={newCatName} 
                onChange={(e) => setNewCatName(e.target.value)} 
                placeholder="Örn: Tatlılar" 
                className="rounded-xl border-[#C8A27A]" 
              />
              <p className="text-xs text-gray-400 mt-1">
                Otomatik ID: {newCatName.trim().toLowerCase().replace(/\s+/g, '-')}
              </p>
            </div>

            <div>
              <label className="block text-sm text-[#8B5E3C] mb-2">İkon Seçiniz</label>
              <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border border-[#E6D3BA] rounded-xl">
                {AVAILABLE_ICONS.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => setNewCatIcon(item.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${newCatIcon === item.id ? 'bg-[#8B5E3C] text-white' : 'hover:bg-[#FAF8F5] text-[#2D1B12]'}`}
                    title={item.label}
                  >
                    <item.icon className="w-6 h-6 mb-1" />
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#8B5E3C] mt-1 text-center">Seçilen İkon: {newCatIcon}</p>
            </div>

            <Button onClick={handleAddCategory} className="w-full bg-[#8B5E3C] text-white hover:bg-[#2D1B12] rounded-xl py-6">
              Kategoriyi Oluştur
            </Button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#E6D3BA]"><div className="flex items-center justify-between"><h3 className="text-xl text-[#2D1B12]">Sipariş Detayı - {selectedOrder.id}</h3><button onClick={() => setShowOrderDetail(false)} className="text-[#8B5E3C] hover:text-[#2D1B12]"><X className="w-6 h-6" /></button></div></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4"><div><p className="text-sm text-[#8B5E3C]">Müşteri</p><p className="text-[#2D1B12] font-bold">{selectedOrder.customerName}</p></div><div><p className="text-sm text-[#8B5E3C]">Sadakat No</p><p className="text-[#2D1B12] font-bold">{selectedOrder.loyaltyNumber}</p></div><div><p className="text-sm text-[#8B5E3C]">Tarih</p><p className="text-[#2D1B12]">{selectedOrder.date}</p></div><div><p className="text-sm text-[#8B5E3C]">Durum</p><Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status === 'Completed' ? 'Tamamlandı' : 'İptal'}</Badge></div></div>
              <div className="border-t border-[#E6D3BA] pt-4"><h4 className="text-[#2D1B12] mb-3 font-bold">Sipariş İçeriği</h4><div className="space-y-2">{selectedOrder.items.map((item, idx) => (<div key={idx} className="flex justify-between p-3 bg-[#FAF8F5] rounded-xl"><div><p className="text-sm text-[#2D1B12] font-bold">{item.name}</p><p className="text-xs text-[#8B5E3C]">Adet: {item.quantity}</p></div><p className="text-sm text-[#2D1B12] font-bold">₺{item.price * item.quantity}</p></div>))}</div></div>
              <div className="border-t border-[#E6D3BA] pt-4 space-y-2"><div className="flex justify-between"><span className="text-[#8B5E3C]">Toplam Tutar:</span><span className="text-[#2D1B12] font-bold">₺{selectedOrder.totalAmount}</span></div><div className="flex justify-between"><span className="text-[#8B5E3C]">Kullanılan Puan:</span><span className="text-red-600 font-bold">{selectedOrder.pointsUsed}</span></div><div className="flex justify-between"><span className="text-[#8B5E3C]">Kazanılan Puan:</span><span className="text-green-600 font-bold">+{selectedOrder.pointsEarned}</span></div>{selectedOrder.couponCode && (<div className="flex justify-between"><span className="text-[#8B5E3C]">Kupon Kodu:</span><span className="text-[#2D1B12] font-bold">{selectedOrder.couponCode}</span></div>)}</div>
              {selectedOrder.status === 'Completed' && (<Button className="w-full bg-red-600 text-white hover:bg-red-700 rounded-xl" onClick={() => handleCancelOrder(selectedOrder.id)}>Siparişi İptal Et</Button>)}
            </div>
          </div>
        </div>
      )}

      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#E6D3BA]"><div className="flex items-center justify-between"><h3 className="text-xl text-[#2D1B12]">Yeni Ürün Ekle</h3><button onClick={() => setShowProductModal(false)} className="text-[#8B5E3C] hover:text-[#2D1B12]"><X className="w-6 h-6" /></button></div></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm text-[#8B5E3C] mb-2">Ürün Adı</label><Input value={newProductName} onChange={(e) => setNewProductName(e.target.value)} placeholder="Ürün adını girin..." className="rounded-xl border-[#C8A27A]" /></div>
              
              {/* KATEGORİ SEÇİMİ (DROPDOWN) */}
              <div>
                <label className="block text-sm text-[#8B5E3C] mb-2">Kategori</label>
                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#C8A27A] text-[#2D1B12] bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                >
                  {dynamicCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div><label className="block text-sm text-[#8B5E3C] mb-2">Açıklama</label><Input value={newProductDescription} onChange={(e) => setNewProductDescription(e.target.value)} placeholder="Ürün açıklaması..." className="rounded-xl border-[#C8A27A]" /></div>
              <div><label className="block text-sm text-[#8B5E3C] mb-2">Görsel URL</label><Input value={newProductImage} onChange={(e) => setNewProductImage(e.target.value)} placeholder="/images/kahve.jpg veya https://..." className="rounded-xl border-[#C8A27A]" /></div>
              <div><label className="block text-sm text-[#8B5E3C] mb-2">Boyut ve Fiyat</label><div className="space-y-2"><div className="flex gap-2"><Input value={tempSize} onChange={(e) => setTempSize(e.target.value)} placeholder="Boyut (örn: Short)" className="rounded-xl border-[#C8A27A]" /><Input type="number" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} placeholder="Fiyat" className="rounded-xl border-[#C8A27A]" /><Button onClick={addProductSize} type="button" className="bg-[#8B5E3C] text-white hover:bg-[#2D1B12] rounded-xl"><Plus className="w-4 h-4" /></Button></div>{newProductSizes.length > 0 && (<div className="space-y-1 mt-2">{newProductSizes.map((size, index) => (<div key={index} className="flex items-center justify-between p-2 bg-[#FAF8F5] rounded-lg"><span className="text-sm text-[#2D1B12]">{size.size}: ₺{size.price}</span><button onClick={() => removeProductSize(index)} className="text-red-600 hover:text-red-800"><X className="w-4 h-4" /></button></div>))}</div>)}</div></div>
              <div><label className="block text-sm text-[#8B5E3C] mb-2">Etiket (Opsiyonel)</label><select value={newProductTag} onChange={(e) => setNewProductTag(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-[#C8A27A] text-[#2D1B12]"><option value="">Etiket Yok</option><option value="Popüler">Popüler</option><option value="Yeni">Yeni</option><option value="Şef Önerisi">Şef Önerisi</option></select></div>
              <div className="flex gap-3 pt-4"><Button onClick={handleAddProduct} className="flex-1 bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] text-white hover:from-[#2D1B12] hover:to-[#2D1B12] rounded-xl">Ürünü Ekle</Button><Button onClick={() => { setShowProductModal(false); setNewProductName(''); setNewProductCategory('standard-coffee'); setNewProductDescription(''); setNewProductTag(''); setNewProductSizes([]); }} variant="outline" className="flex-1 border-[#C8A27A] text-[#8B5E3C] hover:bg-[#E6D3BA] rounded-xl">İptal</Button></div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#E6D3BA]"><div className="flex items-center justify-between"><h3 className="text-xl text-[#2D1B12]">Ürünü Düzenle</h3><button onClick={() => { setShowEditModal(false); setEditingProduct(null); setNewProductName(''); setNewProductCategory('standard-coffee'); setNewProductDescription(''); setNewProductTag(''); setNewProductSizes([]); }} className="text-[#8B5E3C] hover:text-[#2D1B12]"><X className="w-6 h-6" /></button></div></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm text-[#8B5E3C] mb-2">Ürün Adı</label><Input value={newProductName} onChange={(e) => setNewProductName(e.target.value)} placeholder="Ürün adını girin..." className="rounded-xl border-[#C8A27A]" /></div>
              
              {/* KATEGORİ SEÇİMİ (DROPDOWN - EDIT MODU) */}
              <div>
                <label className="block text-sm text-[#8B5E3C] mb-2">Kategori</label>
                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#C8A27A] text-[#2D1B12] bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                >
                  {dynamicCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div><label className="block text-sm text-[#8B5E3C] mb-2">Açıklama</label><Input value={newProductDescription} onChange={(e) => setNewProductDescription(e.target.value)} placeholder="Ürün açıklaması..." className="rounded-xl border-[#C8A27A]" /></div>
              <div><label className="block text-sm text-[#8B5E3C] mb-2">Görsel URL</label><Input value={newProductImage} onChange={(e) => setNewProductImage(e.target.value)} placeholder="/images/kahve.jpg veya https://..." className="rounded-xl border-[#C8A27A]" /></div>
              <div><label className="block text-sm text-[#8B5E3C] mb-2">Boyut ve Fiyat</label><div className="space-y-2"><div className="flex gap-2"><Input value={tempSize} onChange={(e) => setTempSize(e.target.value)} placeholder="Boyut (örn: Short)" className="rounded-xl border-[#C8A27A]" /><Input type="number" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} placeholder="Fiyat" className="rounded-xl border-[#C8A27A]" /><Button onClick={addProductSize} type="button" className="bg-[#8B5E3C] text-white hover:bg-[#2D1B12] rounded-xl"><Plus className="w-4 h-4" /></Button></div>{newProductSizes.length > 0 && (<div className="space-y-1 mt-2">{newProductSizes.map((size, index) => (<div key={index} className="flex items-center justify-between p-2 bg-[#FAF8F5] rounded-lg"><span className="text-sm text-[#2D1B12]">{size.size}: ₺{size.price}</span><button onClick={() => removeProductSize(index)} className="text-red-600 hover:text-red-800"><X className="w-4 h-4" /></button></div>))}</div>)}</div></div>
              <div><label className="block text-sm text-[#8B5E3C] mb-2">Etiket (Opsiyonel)</label><select value={newProductTag} onChange={(e) => setNewProductTag(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-[#C8A27A] text-[#2D1B12]"><option value="">Etiket Yok</option><option value="Popüler">Popüler</option><option value="Yeni">Yeni</option><option value="Şef Önerisi">Şef Önerisi</option></select></div>
              <div className="flex gap-3 pt-4"><Button onClick={handleUpdateProduct} className="flex-1 bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] text-white hover:from-[#2D1B12] hover:to-[#2D1B12] rounded-xl">Değişiklikleri Kaydet</Button><Button onClick={() => { setShowEditModal(false); setEditingProduct(null); setNewProductName(''); setNewProductCategory('standard-coffee'); setNewProductDescription(''); setNewProductTag(''); setNewProductSizes([]); }} variant="outline" className="flex-1 border-[#C8A27A] text-[#8B5E3C] hover:bg-[#E6D3BA] rounded-xl">İptal</Button></div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#E6D3BA]"><div className="flex items-center justify-between"><h3 className="text-xl text-[#2D1B12]">Yeni Kampanya Ekle</h3><button onClick={() => setShowCampaignModal(false)} className="text-[#8B5E3C] hover:text-[#2D1B12]"><X className="w-6 h-6" /></button></div></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm text-[#8B5E3C] mb-2">Kampanya Adı</label><Input value={newCampTitle} onChange={(e) => setNewCampTitle(e.target.value)} placeholder="Örn: Haftasonu Kahve İndirimi" className="rounded-xl border-[#C8A27A]" /></div>
              <div><label className="block text-sm text-[#8B5E3C] mb-2">Açıklama</label><Input value={newCampDesc} onChange={(e) => setNewCampDesc(e.target.value)} placeholder="Kampanya detayları..." className="rounded-xl border-[#C8A27A]" /></div>
              <div><label className="block text-sm text-[#8B5E3C] mb-2">İndirim Tipi</label><select value={newCampType} onChange={(e) => setNewCampType(e.target.value as 'percent' | 'amount')} className="w-full px-4 py-2 rounded-xl border border-[#C8A27A] text-[#2D1B12]"><option value="percent">Yüzde İndirim (%)</option><option value="amount">Sabit Tutar (₺)</option></select></div>
              <div><label className="block text-sm text-[#8B5E3C] mb-2">İndirim Değeri</label><Input type="number" value={newCampValue} onChange={(e) => setNewCampValue(Number(e.target.value))} placeholder="Örn: 20" className="rounded-xl border-[#C8A27A]" /></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm text-[#8B5E3C] mb-2">Başlangıç Tarihi</label><Input type="date" value={newCampStartDate} onChange={(e) => setNewCampStartDate(e.target.value)} className="rounded-xl border-[#C8A27A]" /></div><div><label className="block text-sm text-[#8B5E3C] mb-2">Bitiş Tarihi</label><Input type="date" value={newCampEndDate} onChange={(e) => setNewCampEndDate(e.target.value)} className="rounded-xl border-[#C8A27A]" /></div></div>
              <div><label className="block text-sm text-[#8B5E3C] mb-2">Kupon Kodu (Opsiyonel)</label><Input value={newCampCoupon} onChange={(e) => setNewCampCoupon(e.target.value.toUpperCase())} placeholder="Örn: NEWYEAR veya boş bırakın" className="rounded-xl border-[#C8A27A]" maxLength={10} /><p className="text-xs text-gray-400 mt-1">Boş bırakırsanız otomatik oluşturulur</p></div>
              <div><label className="flex items-center gap-2 text-sm text-[#8B5E3C]"><input type="checkbox" checked={newCampActive} onChange={(e) => setNewCampActive(e.target.checked)} className="rounded border-[#C8A27A]" />Kampanyayı aktif olarak başlat</label></div>
              <div className="flex gap-3 pt-4"><Button onClick={handleCreateCampaign} className="flex-1 bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] text-white hover:from-[#2D1B12] hover:to-[#2D1B12] rounded-xl">Kampanyayı Ekle</Button><Button onClick={() => setShowCampaignModal(false)} variant="outline" className="flex-1 border-[#C8A27A] text-[#8B5E3C] hover:bg-[#E6D3BA] rounded-xl">İptal</Button></div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {showCustomerDetail && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#E6D3BA]"><div className="flex items-center justify-between"><h3 className="text-xl text-[#2D1B12]">Müşteri Detayı - {selectedCustomer.name}</h3><button onClick={() => setShowCustomerDetail(false)} className="text-[#8B5E3C] hover:text-[#2D1B12]"><X className="w-6 h-6" /></button></div></div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6"><div><p className="text-sm text-[#8B5E3C]">Email</p><p className="text-[#2D1B12]">{selectedCustomer.email}</p></div><div><p className="text-sm text-[#8B5E3C]">Sadakat No</p><p className="text-[#2D1B12] font-bold">{selectedCustomer.loyaltyNumber}</p></div><div><p className="text-sm text-[#8B5E3C]">Mevcut Puan</p><p className="text-green-600 font-bold text-xl">{selectedCustomer.points}</p></div><div><p className="text-sm text-[#8B5E3C]">Toplam Sipariş</p><p className="text-[#2D1B12] font-bold text-xl">{selectedCustomer.totalOrders}</p></div></div>
              <div className="border-t border-[#E6D3BA] pt-6"><h4 className="text-[#2D1B12] mb-4 font-bold">Puan Geçmişi</h4><div className="space-y-2"><div className="flex justify-between p-3 bg-[#FAF8F5] rounded-xl"><span className="text-sm text-[#2D1B12]">Sipariş: ORD001</span><span className="text-sm text-green-600 font-bold">+29 puan</span></div><div className="flex justify-between p-3 bg-[#FAF8F5] rounded-xl"><span className="text-sm text-[#2D1B12]">Puan Kullanımı</span><span className="text-sm text-red-600 font-bold">-50 puan</span></div></div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}