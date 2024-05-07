import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { LinkController } from 'src/controllers/link.controller';
import { Link } from 'src/models/link.model';
import { LinkService } from 'src/services/link.service';

@Module({
  imports: [TypegooseModule.forFeature([Link])],
  controllers: [LinkController],
  providers: [LinkService],
})
export class LinkModule {}
