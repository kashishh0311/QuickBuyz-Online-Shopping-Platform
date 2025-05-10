# 🛒 QuickBuyz - Online Shopping Website

**QuickBuyz** is a sleek and modern full-stack e-commerce platform for shopping with ease and style. 🛍️ Discover a wide range of products, manage your cart, and enjoy a seamless shopping experience in a striking black-themed interface that’s as bold as your shopping choices. 🖤 Built with the MERN stack for a fast, scalable solution.

## 🌟 Key Features

- 🛍️ **Curated Product Catalog**: Explore products, categories, and prices with dynamic, engaging content.
- 🔒 **Secure Sign-Up & Login**: Safe access for personalized shopping and order history with JWT-based authentication.
- 🔍 **Product Discovery**: Browse with search, filters (price range, category), and a clean, dark interface.
- 🛒 **Cart Management**: Add, update, or remove items with real-time total calculations.
- 🎟️ **Order Placement**: Place orders, view order history, and track your purchases effortlessly.
- 💸 **Fast Checkout**: Quick and secure checkout process for seamless transactions.
- 📊 **Order Insights**: Track recent orders and manage your shopping history.
- 📝 **Feedback Option**: Share feedback to improve the platform’s product offerings and user experience.
- 🖥️ **Dedicated Panels**:
  - **Client_Frontend**: Your hub for browsing products, managing your cart, and placing orders.
  - **Admin_Frontend**: Oversight for product listings, category management, and user feedback.
- 📱 **Responsive Design**: Looks stunning on mobile, tablet, or desktop with a consistent black theme.

## 🧰 Built With

- **Frontend**: React.js, Tailwind CSS, React Router, Axios, Lucide-React (icons)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT-based with bcrypt for password hashing

## 🔧 Setup Steps

1. **Clone the Project**

   ```bash
   git clone https://github.com/yourusername/QuickBuyz-Shopping-Website.git
   cd quickbuyz
   ```

2. **Install Dependencies**  
   Backend:

   ```bash
   cd Backend
   npm install
   ```

   Client frontend:

   ```bash
   cd ../Client_Frontend
   npm install
   ```

   Admin frontend:

   ```bash
   cd ../Admin_Frontend
   npm install
   ```

3. **Set Up Environment**  
   In `Backend`, create a `.env` file:

   ```
   MONGODB_URI=YOUR_MONGODB_URL
   JWT_SECRET=your_jwt_secret_key
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY=1h
   REFRESH_TOKEN_EXPIRY=7d
   PORT=5000
   ```

   In `Client_Frontend` and `Admin_Frontend`, create a `.env` file:

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Configure MongoDB**

   - Install MongoDB locally or use a cloud service (e.g., MongoDB Atlas).
   - Ensure MongoDB is running on `localhost:27017` or update the `MONGODB_URI` in the `.env` file if using a cloud service.
   - Create a database named `quickbuyz_db`. Collections for products, categories, users, orders, and feedback will be created automatically on first use, or you can seed the database using a provided `seed.js` script in `Backend/db/` (if included).

5. **Start the Platform**  
   Backend:

   ```bash
   cd Backend
   npm run dev
   ```

   Client frontend:

   ```bash
   cd Client_Frontend
   npm run dev
   ```

   Admin frontend:

   ```bash
   cd Admin_Frontend
   npm run dev
   ```

   Visit:

   - Client_Frontend: `http://localhost:3000`
   - Admin_Frontend: `http://localhost:3002`

## 🛍️ How It Works

- 🖱️ Go to `http://localhost:3000` to start as a user.
- 🛒 Sign up, explore the product catalog, and add items to your cart.
- 🛍️ Manage your cart, place orders, and view your order history.
- ⭐ Submit feedback to improve the platform.
- 👨‍💼 Admins manage products, categories, orders, and user feedback at `http://localhost:3002`.

## 📁 Structure

```
├── Backend/              # API for auth, products, orders, and feedback
├── Client_Frontend/      # User browsing and shopping interface
├── Admin_Frontend/       # Product catalog and platform administration
```

## 🖤 Design Highlights

- **Black Theme**: A sleek black interface (`#181824`) with white text for contrast, accented by vibrant green (`#38ce3c`) for actions and red (`#EF4444`) for errors, ensuring a modern and elegant shopping experience.
- **Consistency**: Uniform dark design across user and admin panels for a cohesive look and feel.

## 🛠️ Troubleshooting

- **Order Total Issues**: If you encounter discrepancies in cart totals (e.g., `₹11549.89` instead of `₹4799.96`), ensure the backend recalculates `totalCartAmount` correctly based on `orderItems`. Use the admin panel to verify product prices.
- **Quantity Errors**: If quantities are incorrect (e.g., 4 instead of 1), check the cart update logic in `Client_Frontend` and ensure the backend API updates `orderItems` accurately.
- **Feedback**: Use the feedback feature to report bugs or suggest improvements, helping maintain data consistency and user satisfaction.