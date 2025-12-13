import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

// type minimal pour le payload JWT
interface JwtUser {
  sub: string;
}

// type minimal pour la requête utilisée ici (évite les any d'Express)
interface RequestWithUser {
  user?: JwtUser;
}

@ApiBearerAuth('JWT-auth')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all notes for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of user notes' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  @Get()
  async findAll(@Req() req: RequestWithUser) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User not found');
    return await this.notesService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a specific note by ID for the authenticated user' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiResponse({ status: 200, description: 'Note details' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User not found');
    return await this.notesService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new note for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid note data' })
  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @Req() req: RequestWithUser) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User not found');
    return await this.notesService.create(createNoteDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an existing note for the authenticated user' })
  @ApiParam({ name: 'id', description: 'Note ID to update' })
  @ApiResponse({ status: 200, description: 'Note updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid update data' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto, @Req() req: RequestWithUser) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User not found');
    return await this.notesService.update(id, updateNoteDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User not found');
    return await this.notesService.remove(id, userId);
  }
}
