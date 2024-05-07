import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Link } from 'src/models/link.model';

@Injectable()
export class LinkService {
  constructor(
    @InjectModel(Link)
    private readonly links: ReturnModelType<typeof Link>,
  ) {}

  async generateMaskedUrl(originalUrl: string): Promise<Link> {
    const randomString = this.generateRandomString(6);
    const isValid: boolean = this.isValidUrl(originalUrl);
    const timeToExpire: number = this.expireIn(300000);

    const maskedUrl = `http://localhost:3000/l/${randomString}`;

    const newLink = await this.links.create({
      _id: randomString,
      target: originalUrl,
      link: maskedUrl,
      valid: isValid,
      expireIn: timeToExpire,
    });

    return newLink;
  }

  async getLinkByIdAndCountRedirect(linkId: string): Promise<Link> {
    let link: Link = await this.links.findById(linkId);

    if (!link) {
      throw new NotFoundException('Link not exists');
    }
    if (link.valid === false) {
      throw new NotFoundException('Link is invalid');
    }

    if (link.expireIn < Date.now()) {
      throw new NotFoundException('Expired link');
    }

    link = await this.links.findByIdAndUpdate(
      linkId,
      { $inc: { redirectCount: 1 } },
      { new: true },
    );

    return link;
  }

  async invalidateLink(
    linkId: string,
  ): Promise<{ success: boolean; message: string }> {
    const link = await this.links.findByIdAndUpdate(
      { _id: linkId },
      { valid: false },
    );

    if (!link) {
      throw new NotFoundException('Link not found');
    }
    return {
      success: true,
      message: 'Link invalidated',
    };
  }

  async getLinksStats(linkId: string): Promise<{ redirectsCount: number }> {
    const link = await this.links.findById(linkId);
    if (!link) {
      throw new NotFoundException('Link not found');
    }
    return {
      redirectsCount: link.redirectCount,
    };
  }

  private expireIn(time: number): number {
    return Date.now() + time;
  }

  private isValidUrl(url: string): boolean {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(url);
  }

  private generateRandomString(length: number): string {
    const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
  }
}
