import { useEffect, useMemo, useState } from "react";
import { createOrderApi, getMyOrdersApi } from "./api/orderApi.jsx";
import { categoryFilters, featuredProducts, getProductsApi } from "./api/productApi.jsx";
import { useAuth } from "./context/authContext.jsx";
import "./App.css";

const emptyForms = {
  customer: { name: "", email: "", password: "", phone: "" },
  seller: { name: "", email: "", password: "", phone: "", storeName: "", storeDescription: "" },
};

const emptyDelivery = {
  name: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  notes: "",
};

const orderSteps = [
  { key: "placed", label: "Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "packing", label: "Packing" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

const statusCopy = {
  placed: "Your order has been received.",
  confirmed: "The seller accepted your order.",
  packing: "Your items are being packed.",
  shipped: "The package has left the seller.",
  out_for_delivery: "The package is out for delivery.",
  delivered: "Delivered successfully.",
  cancelled: "This order was cancelled.",
};

const formatPrice = (value) => `Rs. ${Number(value).toLocaleString("en-IN")}`;
const routeFromHash = () => window.location.hash.replace("#", "") || "home";

const App = () => {
  const { user, seller, loading, authError, loginCustomer, loginSeller, registerCustomer, registerSeller, logout } = useAuth();
  const [route, setRoute] = useState(routeFromHash());
  const [products, setProducts] = useState(featuredProducts);
  const [mode, setMode] = useState("customer");
  const [intent, setIntent] = useState("login");
  const [forms, setForms] = useState(emptyForms);
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [delivery, setDelivery] = useState(emptyDelivery);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [localError, setLocalError] = useState("");
  const [notice, setNotice] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const activeForm = forms[mode];

  useEffect(() => {
    const syncRoute = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", syncRoute);
    getProductsApi().then(setProducts);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  const loadOrders = async () => {
    if (!user || user.role !== "customer") {
      setOrders([]);
      return;
    }

    setOrdersLoading(true);
    setOrdersError("");
    try {
      const data = await getMyOrdersApi();
      setOrders(data.orders || []);
    } catch (error) {
      setOrdersError(error.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user?._id, user?.role]);

  const visibleProducts = useMemo(() => (
    activeCategory === "all" ? products : products.filter((product) => product.category === activeCategory)
  ), [activeCategory, products]);
  const purchasedNames = useMemo(() => new Set(orders.flatMap((order) => order.items?.map((item) => item.name) || [])), [orders]);
  const selectedProduct = useMemo(() => products.find((product) => product._id === route.split("/")[1]), [products, route]);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.discountedPrice || item.price) * item.quantity, 0), [cart]);
  const shippingCharge = cart.length && subtotal < 2999 ? 149 : 0;
  const total = subtotal + shippingCharge;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const go = (target) => {
    window.location.hash = target;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateField = (field, value) => setForms((current) => ({
    ...current,
    [mode]: { ...current[mode], [field]: value },
  }));
  const updateDelivery = (field, value) => setDelivery((current) => ({ ...current, [field]: value }));
  const isSaved = (productId) => wishlist.some((item) => item._id === productId);
  const wasPurchased = (product) => purchasedNames.has(product.name);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");
    setNotice("");

    try {
      if (mode === "customer" && intent === "login") await loginCustomer(activeForm);
      if (mode === "seller" && intent === "login") await loginSeller(activeForm);
      if (mode === "customer" && intent === "register") await registerCustomer(activeForm);
      if (mode === "seller" && intent === "register") await registerSeller(activeForm);
      setNotice(`${mode === "seller" ? "Seller" : "Customer"} ${intent === "login" ? "login" : "account"} ready.`);
    } catch (error) {
      setLocalError(error.message);
    }
  };

  const handleDemoFill = () => setForms((current) => ({
    ...current,
    [mode]: {
      ...current[mode],
      name: mode === "seller" ? "Aarav Merchant" : "Mira Kapoor",
      email: mode === "seller" ? "seller@example.com" : "customer@example.com",
      password: "secret123",
      phone: "9876543210",
      storeName: mode === "seller" ? "Studio Rang" : current[mode].storeName,
      storeDescription: mode === "seller" ? "Independent home, fashion, and lifestyle goods." : current[mode].storeDescription,
    },
  }));

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item._id === product._id);
      return existing
        ? current.map((item) => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }];
    });
    setCheckoutMessage(`${product.name} added to cart.`);
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart((current) => quantity < 1
      ? current.filter((item) => item._id !== productId)
      : current.map((item) => item._id === productId ? { ...item, quantity } : item));
  };

  const toggleWishlist = (product) => {
    setWishlist((current) => current.some((item) => item._id === product._id)
      ? current.filter((item) => item._id !== product._id)
      : [...current, product]);
  };

  const moveWishlistToCart = (product) => {
    addToCart(product);
    setWishlist((current) => current.filter((item) => item._id !== product._id));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setCheckoutError("");
    setCheckoutMessage("");

    if (!user) return setCheckoutError("Please login as a customer before placing an order.");
    if (user.role !== "customer") return setCheckoutError("Seller accounts cannot place customer orders.");
    if (!cart.length) return setCheckoutError("Your cart is empty.");

    setPlacingOrder(true);
    try {
      const data = await createOrderApi({
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          name: item.name,
          price: item.discountedPrice || item.price,
          image: item.image || item.images?.[0]?.url,
          seller: item.seller,
        })),
        shippingAddress: {
          name: delivery.name,
          phone: delivery.phone,
          street: delivery.street,
          city: delivery.city,
          state: delivery.state,
          pincode: delivery.pincode,
          country: delivery.country,
        },
        paymentMethod,
        paymentToken: paymentMethod === "cod" ? undefined : `mock-${paymentMethod}-${Date.now()}`,
        notes: delivery.notes,
      });

      setCart([]);
      setOrders((current) => [data.order, ...current]);
      setCheckoutMessage(`Order placed successfully. Order ID: ${data.order._id}`);
      setDelivery(emptyDelivery);
      setPaymentMethod("cod");
      go("orders");
    } catch (error) {
      setCheckoutError(error.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  const ProductActions = ({ product }) => (
    <div className="commerce-actions">
      <button type="button" onClick={() => addToCart(product)}>Add to cart</button>
      <button type="button" className={isSaved(product._id) ? "saved" : ""} onClick={() => toggleWishlist(product)}>
        {isSaved(product._id) ? "Saved" : "Wishlist"}
      </button>
    </div>
  );

  const ProductCard = ({ product }) => (
    <article className="product-card">
      <button type="button" className="product-open" onClick={() => go(`product/${product._id}`)}>
        <div className="product-image" style={{ "--accent-color": product.accent || "#2f9c95" }}>
          <img src={product.image || product.images?.[0]?.url} alt={product.name} />
          <span>{product.category}</span>
          {wasPurchased(product) && <b>Purchased before</b>}
        </div>
        <div>
          <p>{product.seller}</p>
          <h3>{product.name}</h3>
        </div>
      </button>
      <div className="product-info">
        <div className="price-row">
          <strong>{formatPrice(product.discountedPrice || product.price)}</strong>
          <span>{product.rating} rating</span>
        </div>
        <ProductActions product={product} />
      </div>
    </article>
  );

  const LineItem = ({ item, mode: listMode }) => (
    <article className="line-item">
      <button type="button" className="line-image-button" onClick={() => go(`product/${item._id}`)}>
        <img src={item.image || item.images?.[0]?.url} alt={item.name} />
      </button>
      <div>
        <strong>{item.name}</strong>
        <span>{formatPrice(item.discountedPrice || item.price)}</span>
      </div>
      {listMode === "cart" ? (
        <div className="quantity-control">
          <button type="button" onClick={() => updateCartQuantity(item._id, item.quantity - 1)}>-</button>
          <span>{item.quantity}</span>
          <button type="button" onClick={() => updateCartQuantity(item._id, item.quantity + 1)}>+</button>
        </div>
      ) : (
        <button type="button" className="small-action" onClick={() => moveWishlistToCart(item)}>Move to cart</button>
      )}
    </article>
  );

  const renderMarket = () => (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Independent commerce, curated daily</p>
          <h1>Shop smaller brands with the confidence of a premium marketplace.</h1>
          <p className="hero-text">Zhatpat brings boutique sellers, expressive product pages, and customer-first checkout into one modern storefront.</p>
          <div className="hero-actions">
            <button type="button" className="primary-action" onClick={() => go("dashboard")}>Explore picks</button>
            <button type="button" className="secondary-action" onClick={() => go("seller")}>Open seller login</button>
          </div>
        </div>
        <div className="hero-board">
          <div className="hero-image-wrap">
            <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85" alt="Modern product display with furniture and home goods" />
          </div>
          <div className="floating-panel sales-panel"><span>Today</span><strong>18k+</strong><small>orders shipped through boutique sellers</small></div>
          <div className="floating-panel seller-panel"><span>Seller mood</span><strong>Calm growth</strong><small>84 stores live this month</small></div>
        </div>
      </section>
      <section className="metrics-strip">
        <div><strong>4.8</strong><span>average product rating</span></div>
        <div><strong>2 day</strong><span>priority dispatch on featured drops</span></div>
        <div><strong>Zero clutter</strong><span>storefronts designed around discovery</span></div>
      </section>
      <section className="market-section">
        <div className="section-heading">
          <div><p className="eyebrow">Dashboard</p><h2>Explore products by category</h2></div>
          <span>{visibleProducts.length} items</span>
        </div>
        <div className="category-filter">
          {categoryFilters.map((category) => (
            <button type="button" key={category} className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)}>{category}</button>
          ))}
        </div>
        <div className="product-grid">{visibleProducts.map((product) => <ProductCard product={product} key={product._id} />)}</div>
      </section>
    </>
  );

  const renderProductDetail = () => {
    if (!selectedProduct) {
      return <section className="page-section"><p className="empty-state">Product not found.</p></section>;
    }

    return (
      <section className="product-detail-page">
        <button type="button" className="ghost-button" onClick={() => go("dashboard")}>Back to dashboard</button>
        <div className="product-detail-layout">
          <div className="detail-image">
            <img src={selectedProduct.image || selectedProduct.images?.[0]?.url} alt={selectedProduct.name} />
            {wasPurchased(selectedProduct) && <span>Purchased before</span>}
          </div>
          <div className="detail-copy">
            <p className="eyebrow">{selectedProduct.category}</p>
            <h1>{selectedProduct.name}</h1>
            <p>{selectedProduct.description || "A curated product from an independent seller, selected for quality, usefulness, and distinctive design."}</p>
            <div className="detail-meta">
              <div><span>Seller</span><strong>{selectedProduct.seller}</strong></div>
              <div><span>Rating</span><strong>{selectedProduct.rating}</strong></div>
              <div><span>Stock</span><strong>{selectedProduct.stock}</strong></div>
            </div>
            <div className="detail-price">
              <strong>{formatPrice(selectedProduct.discountedPrice || selectedProduct.price)}</strong>
              {selectedProduct.discountedPrice && <span>{formatPrice(selectedProduct.price)}</span>}
            </div>
            {wasPurchased(selectedProduct) && <p className="form-success">Purchased before. You can reorder this item from here.</p>}
            <ProductActions product={selectedProduct} />
          </div>
        </div>
      </section>
    );
  };

  const renderCart = () => (
    <section className="page-section">
      <div className="section-heading"><div><p className="eyebrow">Customer basket</p><h2>Cart</h2></div><span>{cartCount} items</span></div>
      <div className="line-item-list">{cart.length ? cart.map((item) => <LineItem item={item} mode="cart" key={item._id} />) : <p className="empty-state">Your cart is empty.</p>}</div>
      <div className="cart-total-panel">
        <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
        <div><span>Shipping</span><strong>{shippingCharge ? formatPrice(shippingCharge) : "Free"}</strong></div>
        <div><span>Total</span><strong>{formatPrice(total)}</strong></div>
        <button type="button" className="submit-button" onClick={() => go("checkout")} disabled={!cart.length}>Checkout</button>
      </div>
    </section>
  );

  const renderWishlist = () => (
    <section className="page-section">
      <div className="section-heading"><div><p className="eyebrow">Saved for later</p><h2>Wishlist</h2></div><span>{wishlist.length} items</span></div>
      <div className="line-item-list">{wishlist.length ? wishlist.map((item) => <LineItem item={item} mode="wishlist" key={item._id} />) : <p className="empty-state">Wishlist is empty.</p>}</div>
    </section>
  );

  const renderCheckout = () => (
    <section className="checkout-section page-only">
      <div className="checkout-column">
        <div className="section-heading compact-heading"><div><p className="eyebrow">Ready to place</p><h2>Order summary</h2></div><span>{cartCount} items</span></div>
        <div className="line-item-list">{cart.length ? cart.map((item) => <LineItem item={item} mode="cart" key={item._id} />) : <p className="empty-state">Your cart is empty.</p>}</div>
      </div>
      <form className="checkout-card" onSubmit={placeOrder}>
        <p className="eyebrow">Secure checkout</p>
        <h2>Delivery and payment</h2>
        <div className="checkout-grid">
          <label>Full name<input value={delivery.name} onChange={(event) => updateDelivery("name", event.target.value)} required /></label>
          <label>Phone<input value={delivery.phone} onChange={(event) => updateDelivery("phone", event.target.value)} required /></label>
        </div>
        <label>Address<input value={delivery.street} onChange={(event) => updateDelivery("street", event.target.value)} required /></label>
        <div className="checkout-grid">
          <label>City<input value={delivery.city} onChange={(event) => updateDelivery("city", event.target.value)} required /></label>
          <label>State<input value={delivery.state} onChange={(event) => updateDelivery("state", event.target.value)} required /></label>
          <label>Pincode<input value={delivery.pincode} onChange={(event) => updateDelivery("pincode", event.target.value)} required /></label>
          <label>Country<input value={delivery.country} onChange={(event) => updateDelivery("country", event.target.value)} required /></label>
        </div>
        <label>Delivery notes<textarea rows="3" value={delivery.notes} onChange={(event) => updateDelivery("notes", event.target.value)} /></label>
        <div className="payment-options">
          {["cod", "upi", "card", "netbanking"].map((method) => (
            <label key={method} className={paymentMethod === method ? "active" : ""}>
              <input type="radio" name="paymentMethod" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
              {method === "cod" ? "Cash on delivery" : method.toUpperCase()}
            </label>
          ))}
        </div>
        <div className="order-summary">
          <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
          <div><span>Shipping</span><strong>{shippingCharge ? formatPrice(shippingCharge) : "Free"}</strong></div>
          <div><span>Total</span><strong>{formatPrice(total)}</strong></div>
        </div>
        {checkoutError && <p className="form-error">{checkoutError}</p>}
        {checkoutMessage && <p className="form-success">{checkoutMessage}</p>}
        <button type="submit" className="submit-button checkout-submit" disabled={placingOrder || !cart.length}>{placingOrder ? "Placing order" : paymentMethod === "cod" ? "Place COD order" : "Pay and place order"}</button>
      </form>
    </section>
  );

  const renderOrders = () => (
    <section className="orders-section page-only">
      <div className="section-heading">
        <div><p className="eyebrow">Track every step</p><h2>Orders</h2></div>
        <button type="button" className="ghost-button" onClick={loadOrders} disabled={ordersLoading}>{ordersLoading ? "Refreshing" : "Refresh"}</button>
      </div>
      {!user ? <p className="empty-state">Login as a customer to see your orders.</p>
        : user.role !== "customer" ? <p className="empty-state">Seller accounts can manage sales from the seller desk. Customer order tracking appears here.</p>
          : ordersError ? <p className="form-error">{ordersError}</p>
            : orders.length === 0 ? <p className="empty-state">No orders yet. Place an order from the cart to start tracking.</p>
              : (
                <div className="orders-list">
                  {orders.map((order) => {
                    const activeIndex = order.orderStatus === "cancelled" ? -1 : Math.max(0, orderSteps.findIndex((step) => step.key === order.orderStatus));
                    return (
                      <article className="order-card" key={order._id}>
                        <div className="order-card-head">
                          <div><span>Order #{order._id?.slice(-8).toUpperCase()}</span><strong>{statusCopy[order.orderStatus] || "Order update available."}</strong></div>
                          <div><span>{new Date(order.createdAt).toLocaleDateString("en-IN")}</span><strong>{formatPrice(order.total)}</strong></div>
                        </div>
                        <div className="order-items">{order.items?.map((item) => <div className="order-item-pill" key={item._id || item.name}>{item.image && <img src={item.image} alt={item.name} />}<span>{item.name} x {item.quantity}</span></div>)}</div>
                        <div className={`tracking-rail ${order.orderStatus === "cancelled" ? "cancelled" : ""}`}>
                          {orderSteps.map((step, index) => <div className={index <= activeIndex ? "complete" : ""} key={step.key}><span></span><p>{step.label}</p></div>)}
                        </div>
                        <div className="order-meta"><span>Payment: {order.paymentMethod?.toUpperCase()} / {order.paymentStatus}</span><span>Delivery: {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</span></div>
                      </article>
                    );
                  })}
                </div>
              )}
    </section>
  );

  const renderSeller = () => (
    <section className="seller-section page-only">
      <div><p className="eyebrow">For sellers</p><h2>A seller desk that cares about the craft and the numbers.</h2><p>Add products, track orders, and build a brand space without looking boxed into a generic catalog template.</p></div>
      <div className="seller-dashboard-preview">
        <div className="dashboard-row"><span>Revenue</span><strong>Rs. 4,82,900</strong></div>
        <div className="dashboard-row"><span>Open orders</span><strong>126</strong></div>
        <div className="dashboard-row"><span>Returning customers</span><strong>42%</strong></div>
      </div>
    </section>
  );

  const renderAuth = () => (
    <section className="auth-section page-only">
      <div className="auth-copy"><p className="eyebrow">Two doors, one marketplace</p><h2>{mode === "seller" ? "Seller access" : "Customer access"}</h2><p>Customers can move straight into shopping, while sellers get a dedicated entry point for managing their store.</p></div>
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="segmented-control"><button type="button" className={mode === "customer" ? "active" : ""} onClick={() => setMode("customer")}>Customer</button><button type="button" className={mode === "seller" ? "active" : ""} onClick={() => setMode("seller")}>Seller</button></div>
        <div className="intent-row"><label><input type="radio" name="intent" checked={intent === "login"} onChange={() => setIntent("login")} />Login</label><label><input type="radio" name="intent" checked={intent === "register"} onChange={() => setIntent("register")} />Register</label></div>
        {intent === "register" && <label>Full name<input value={activeForm.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Your name" required /></label>}
        <label>Email<input type="email" value={activeForm.email} onChange={(event) => updateField("email", event.target.value)} placeholder="you@example.com" required /></label>
        <label>Password<input type="password" value={activeForm.password} onChange={(event) => updateField("password", event.target.value)} placeholder="Minimum 6 characters" required /></label>
        {intent === "register" && <label>Phone<input value={activeForm.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="9876543210" /></label>}
        {mode === "seller" && intent === "register" && <><label>Store name<input value={activeForm.storeName} onChange={(event) => updateField("storeName", event.target.value)} placeholder="Studio Rang" required /></label><label>Store description<textarea value={activeForm.storeDescription} onChange={(event) => updateField("storeDescription", event.target.value)} placeholder="What do you sell?" rows="3" /></label></>}
        {(localError || authError) && <p className="form-error">{localError || authError}</p>}
        {notice && <p className="form-success">{notice}</p>}
        <div className="form-actions"><button type="submit" className="submit-button" disabled={loading}>{loading ? "Please wait" : `${intent === "login" ? "Login" : "Create"} ${mode}`}</button><button type="button" className="ghost-button" onClick={handleDemoFill}>Fill demo</button></div>
        {user && <div className="session-note">Logged in as <strong>{user.name}</strong>{seller?.storeName ? <span>Store: {seller.storeName}</span> : <span>Customer profile active</span>}</div>}
      </form>
    </section>
  );

  const renderPage = () => {
    if (route.startsWith("product/")) return renderProductDetail();
    if (route === "cart") return renderCart();
    if (route === "wishlist") return renderWishlist();
    if (route === "checkout") return renderCheckout();
    if (route === "orders") return renderOrders();
    if (route === "seller") return renderSeller();
    if (route === "auth") return renderAuth();
    return renderMarket();
  };

  return (
    <main className="app-shell">
      <nav className="topbar" aria-label="Primary navigation">
        <button type="button" className="brand" onClick={() => go("home")} aria-label="Zhatpat home"><span className="brand-mark">Z</span><span>Zhatpat</span></button>
        <div className="nav-links">
          <button type="button" onClick={() => go("dashboard")}>Dashboard</button>
          <button type="button" onClick={() => go("cart")}>Cart</button>
          <button type="button" onClick={() => go("wishlist")}>Wishlist</button>
          <button type="button" onClick={() => go("orders")}>Orders</button>
          <button type="button" onClick={() => go("seller")}>Sell</button>
          <button type="button" onClick={() => go("auth")}>Login</button>
        </div>
        <div className="user-chip">
          {user ? <><span>{user.role}: {user.name}</span><button type="button" onClick={logout}>Logout</button></> : <button type="button" onClick={() => go("auth")}>Start</button>}
          <button type="button" onClick={() => go("cart")}>Cart {cartCount}</button>
        </div>
      </nav>
      {renderPage()}
    </main>
  );
};

export default App;
