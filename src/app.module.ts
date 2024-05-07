import { Module } from '@nestjs/common';
import { LinkModule } from './modules/link.module';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    LinkModule,
    TypegooseModule.forRoot('mongodb://localhost:27017/link-tracker'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
