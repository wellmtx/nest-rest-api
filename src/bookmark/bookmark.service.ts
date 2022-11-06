import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dtos';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { user_id: userId },
    });

    return bookmarks;
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { user_id: userId, id: bookmarkId },
    });

    return bookmark;
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: { user_id: userId, ...dto },
    });

    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    // get the bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    // check if user owns the bookmark
    if (!bookmark || bookmark.user_id !== userId)
      throw new ForbiddenException('Access to resources denied!');

    const bookmarkUpdated = await this.prisma.bookmark.update({
      where: { id: bookmarkId },
      data: { ...dto },
    });

    // return bookmark updated
    return bookmarkUpdated;
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    // get the bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    // check if user owns the bookmark
    if (!bookmark || bookmark.user_id !== userId)
      throw new ForbiddenException('Access to resources denied!');

    await this.prisma.bookmark.delete({ where: { id: bookmarkId } });
  }
}
