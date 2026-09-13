import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config"
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { CategoryModule } from 'src/modules/categories/category.module';
import { ProductModule } from 'src/modules/product/product.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { BasketModule } from 'src/modules/basket/basket.module';
import { SeedModule } from 'src/modules/seeders/seed.module';
import { UserModule } from 'src/modules/users/user.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal : true,
  }), TypeOrmModule.forRoot(TypeOrmConfig()),SeedModule, AuthModule,CategoryModule, ProductModule, BasketModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
