import { NestFactory, Reflector } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { RolesGuard } from "./user/auth/roles.guard";

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);
  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("ShowFlix App")
    .setDescription("The showflix API description")
    .setVersion("1.0")
    .addTag("api")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/docs", app, document);

  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  await app.listen(3000);
}

bootstrap();
