# Ski Shop - E-commerce Platform

A full-stack e-commerce application for ski equipment, built with Angular (frontend) and ASP.NET Core (backend), featuring payment processing with Stripe.

## Project Structure

This repository contains multiple components of the Ski Shop application:

```
skishop/
├── client/                 # Angular frontend application
├── API/                   # ASP.NET Core Web API backend
├── Core/                  # Domain models and business logic
├── Infrastructure/        # Data access and external services
└── docker-compose.yml     # Docker configuration
```

## Quick Start

### Prerequisites

- **Node.js** (v18 or later)
- **.NET 8 SDK**
- **Docker** (for database)
- **Stripe Account** (for payment processing)

### 1. Clone Repository

```bash
git clone [repository-url]
cd skishop
```

### 2. Backend Setup

```bash
# Start database with Docker
docker-compose up -d

# Navigate to API directory
cd API

# Restore packages
dotnet restore

# Run database migrations
dotnet ef database update

# Start the API server
dotnet run
```

The API will be available at `https://localhost:5024`

### 3. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
ng serve
```

The frontend will be available at `http://localhost:4200`

## Documentation

Each component has its own detailed documentation:

- **[Frontend Documentation](./client/README.md)** - Angular application setup, Stripe configuration, and testing
- **Backend Documentation** - Coming soon (ASP.NET Core API)

## Features

### 🛍️ E-commerce Functionality
- Product catalog with filtering and search
- Shopping cart management
- User authentication and registration
- Order management

### 💳 Payment Processing
- Stripe integration for secure payments
- Multiple payment methods support
- Test mode for development

### 🎯 User Experience
- Responsive design with Tailwind CSS
- Material Design components
- Progressive checkout flow
- Address and delivery management

## Technology Stack

### Frontend
- **Angular 19** - Modern web framework
- **Material Design** - UI components
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type-safe development
- **Stripe Elements** - Payment processing

### Backend
- **ASP.NET Core 8** - Web API framework
- **Entity Framework Core** - ORM
- **SQL Server** - Database
- **AutoMapper** - Object mapping
- **JWT Authentication** - Secure API access

### Infrastructure
- **Docker** - Containerization
- **Redis** - Caching (optional)

## Development

### Running Tests

**Frontend:**
```bash
cd client
npm test
```

**Backend:**
```bash
cd API
dotnet test
```

### Building for Production

**Frontend:**
```bash
cd client
ng build
```

**Backend:**
```bash
cd API
dotnet publish
```

## Environment Configuration

### Frontend Environment Variables
- `stripePublicKey` - Stripe publishable key
- `apiUrl` - Backend API URL

### Backend Environment Variables
- `ConnectionStrings:DefaultConnection` - Database connection string
- `Stripe:SecretKey` - Stripe secret key
- `JWT:Key` - JWT signing key

## Testing with Stripe

The application uses Stripe test mode for development. Use these test card numbers:

### Successful Payments
- **Visa**: `4242 4242 4242 4242`
- **Mastercard**: `5555 5555 5555 4444`

### Declined Payments
- **Generic decline**: `4000 0000 0000 0002`
- **Insufficient funds**: `4000 0000 0000 9995`

**Additional Details:**
- **Expiry**: Any future date (e.g., `12/25`)
- **CVC**: Any 3 digits (e.g., `123`)

For more test scenarios, see the [Stripe Testing Documentation](https://stripe.com/docs/testing#cards).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the individual component documentation
- Review the [Frontend README](./client/README.md) for frontend-specific issues
- Open an issue for bugs or feature requests