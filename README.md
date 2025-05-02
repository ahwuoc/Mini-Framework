# MiniFw: A Lightweight Framework for Bun

MiniFw is a lightweight, high-performance framework built for Bun runtime. It follows a decorator-based approach similar to NestJS, with a simplified syntax and a focus on performance.

## Core Architecture

### Decorators

MiniFw uses three main types of decorators:

1. **Class Decorators**:
   - `@Controller('/path')` - Defines a controller with a base path
   - `@InjectTable()` - Used for repository/service class marking

2. **Method Decorators**:
   - HTTP Methods: `@GET()`, `@POST()`, `@PUT()`, `@PATCH()`, `@DELETE()`
   - Each can take an optional path parameter

3. **Parameter Decorators**:
   - `@Body()` - Injects the request body
   - `@Inject()` - Dependency injection for parameters
   - `@Res()` - Injects the response manager

### Core Components

- **MiniFw Manager**: The main HTTP server that handles routing and request processing
- **App Manager**: Orchestrates controller registration and route setup
- **DI Container**: Handles dependency injection throughout the application
- **Response Manager**: Provides utilities for creating standardized responses (JSON, HTML, redirects)
- **Metadata Manager**: Works with Reflect Metadata to store and retrieve decorator information

### Request Flow

1. The server receives an HTTP request
2. The framework matches the request against registered routes
3. Parameters are automatically injected based on decorators
4. Controller methods are executed with proper context
5. Response is generated and returned

## Project Structure

```
src/
├── controllers/       # Route handlers with decorators
├── core/              # Framework internals
│   ├── decorators/    # TypeScript decorators
│   ├── dynamic/       # Dynamic loading utilities
│   ├── manager/       # Core managers
│   └── utils/         # Helper functions
├── database/          # Database connectors
├── repository/        # Data access layer
├── services/          # Business logic
└── main.ts            # Application entry point
```

## Key Features

- **Declarative Programming**: Using decorators for routes and dependency injection
- **Dynamic Loading**: Controllers are automatically discovered and loaded
- **Dependency Injection**: Automatic constructor injection for services
- **Typed Responses**: Helper methods for common response types
- **Path Parameters**: Support for route parameters with pattern matching
- **Middleware Support**: Via request hooks
- **React SSR Support**: Built-in server-side rendering for React components

## Example Usage

```typescript
// Controller
@Controller("/users")
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @GET()
  getUser(ctx: Context) {
    return ctx.res.ok("User data");
  }

  @POST()
  addUser(ctx: Context, @Body() body: any) {
    return ctx.res.ok(body);
  }
}

// Starting the application
const app = new ManagerApp();
app.listen(3000);
```

## Technical Details

- Built specifically for Bun runtime
- Uses ESM modules natively
- TypeScript for type safety
- Reflect-metadata for decorator metadata
- Automatic parameter parsing for JSON and plain text
- Colorized console output for routes during startup

MiniFw aims to combine the best aspects of modern frameworks like NestJS with the performance benefits of Bun, creating a lightweight yet powerful solution for building web applications.
