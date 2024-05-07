import {
  Controller,
  Post,
  Body,
  Get,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { InputSchemaCreateLink } from 'src/dtos/create-link.dto';
import { LinkService } from 'src/services/link.service';

@Controller('/')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post('create')
  async createLink(@Body() input: InputSchemaCreateLink) {
    const { createLink } = input;

    const maskedUrl = await this.linkService.generateMaskedUrl(createLink.url);

    if (maskedUrl.valid) {
      return {
        maskedUrl: `${maskedUrl.link}?password=${createLink.password}`,
      };
    } else {
      throw new NotFoundException('InvalidURL');
    }
  }

  @Get('/l/:id/stats')
  getLinksStats(@Param('id') id: string) {
    return this.linkService.getLinksStats(id);
  }

  @Get('/l/:id/')
  async getLink(@Param('id') id: string) {
    try {
      const link = await this.linkService.getLinkByIdAndCountRedirect(id);
      return link;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @Put('/l/:id/invalidate')
  async invalidateLink(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    const isInvalidated = await this.linkService.invalidateLink(id);
    return isInvalidated;
  }
}
