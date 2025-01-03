# Full-Stack E-Commerce Platform

## Overview
This project is a full-stack e-commerce platform designed to explore and showcase modern web development techniques. It features a dynamic and responsive user interface, secure user management, and real-world functionalities such as payment processing and email notifications. The platform simulates a complete shopping experience and demonstrates a seamless integration of various technologies.

## Features
- **Frontend**:
  - Built with **Angular** for a dynamic and responsive UI.
  - State management handled by **NgRx** for predictable application behavior.
  - Styled with **Tailwind CSS** for rapid and consistent UI development.

- **Backend**:
  - Developed using **Node.js** with **TypeScript** for robust and type-safe server logic.
  - **PostgreSQL** database for secure and scalable data storage.

- **Integrations**:
  - **Stripe** for payment processing, enabling a realistic shopping experience.
  - **Nodemailer** for email functionalities, including password resets and order confirmations.

- **Security**:
  - User authentication and authorization implemented with **bcrypt** and **JWT**.

## Technologies Used
### Frontend
- Angular
- NgRx
- Tailwind CSS

### Backend
- Node.js
- TypeScript
- PostgreSQL

### Integrations
- Stripe
- Nodemailer

### Security
- Bcrypt
- JWT

## Installation and Setup
### Prerequisites
- Node.js
- PostgreSQL
- Stripe Account

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/amank-04/E-Cart.git
   cd E-Cart
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     DATABASE_URL=your-database-url
     STRIPE_SECRET_KEY=your-stripe-secret-key
     JWT_SECRET=your-jwt-secret
     EMAIL_SERVICE=your-email-service
     EMAIL_USER=your-email-username
     EMAIL_PASSWORD=your-email-password
     ```

4. Run database migrations:
   ```bash
   npm run migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Access the application at `http://localhost:4200`.

## Usage
- Register or log in to explore the platform.
- Browse products, add items to the cart, and proceed to checkout.
- Use a valid Stripe test card to simulate payment.
- Receive email notifications for order confirmation and password resets.

## Future Enhancements
- Add support for product reviews and ratings.
- Implement an admin dashboard for managing products and orders.
- Optimize performance and scalability for production.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- [Angular](https://angular.io/)
- [NgRx](https://ngrx.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Stripe](https://stripe.com/)
- [Nodemailer](https://nodemailer.com/)

## Contact
For questions or feedback, please reach out to [ecartserviceind@gmail.com](mailto:ecartserviceind@gmail.com).

