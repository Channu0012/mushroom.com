import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('search')
@Public()
@Controller({ path: 'search', version: '1' })
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  search(@Query('q') q: string, @Query('type') type?: string, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.searchService.search(q || '', type, +page, +limit);
  }
}
