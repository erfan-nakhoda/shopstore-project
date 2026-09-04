import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SecuritySchemeObject, SwaggerModule } from "@nestjs/swagger";

function BearerAuthConfig() : SecuritySchemeObject {
    return {
        name : 'Authorization',
        type : "http",
        in : "header",
        bearerFormat : 'JWT',
        scheme : "bearer"
    }
}

export function SwaggerConfig(app : INestApplication) {
    const jsDoc = new DocumentBuilder()
    .setTitle("Captain Dev Shop")
    .setDescription("captain shop as a preview for getting paid")
    .setVersion("1.0.0")
    .addBearerAuth(BearerAuthConfig())
    .build()

    const createdDoc = SwaggerModule.createDocument(app, jsDoc)
    SwaggerModule.setup('/swagger', app, createdDoc)
    console.log(`swagger > http://localhost:${process.env.PORT}`)
}