import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { getCollection } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params;
    
    // Validate lesson ID (should be a number)
    if (!/^\d+$/.test(lessonId)) {
      return NextResponse.json(
        { error: 'Invalid lesson ID. Must be a number.' },
        { status: 400 }
      );
    }

    // Get lessons collection from MongoDB
    const lessonsCollection = await getCollection('lessons');
    
    // Look up lesson metadata by ID from MongoDB
    const lessonMetadata = await lessonsCollection.findOne({ 
      id: parseInt(lessonId) 
    });

    if (!lessonMetadata) {
      return NextResponse.json(
        { error: `Lesson ${lessonId} not found.` },
        { status: 404 }
      );
    }

    // Load the corresponding CSV file from lessons/
    const csvFileName = lessonMetadata.csv;
    const filePath = path.join(process.cwd(), 'lessons', csvFileName);
    
    // Check if CSV file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return NextResponse.json(
        { error: `CSV file for lesson ${lessonId} not found.` },
        { status: 404 }
      );
    }

    // Read the CSV file
    const csvContent = await fs.readFile(filePath, 'utf-8');
    
    // Parse CSV to JSON using Papa Parse
    const result = Papa.parse(csvContent, {
      header: true, // Use first row as headers
      skipEmptyLines: true, // Skip empty lines
      transform: (value, field) => {
        // Convert empty strings to null for optional fields
        if (value === '') return null;
        return value;
      }
    });

    // Check for parsing errors
    if (result.errors.length > 0) {
      console.error('CSV parsing errors:', result.errors);
      return NextResponse.json(
        { error: 'Error parsing CSV file.' },
        { status: 500 }
      );
    }

    // Combine metadata + parsed CSV into one JSON response
    const response = {
      lessonId: parseInt(lessonId),
      title: lessonMetadata.title,
      description: lessonMetadata.description,
      difficulty: lessonMetadata.difficulty,
      tags: lessonMetadata.tags,
      totalItems: result.data.length,
      data: result.data,
      // Include additional metadata
      unit: lessonMetadata.unit,
      order: lessonMetadata.order,
      estimatedTime: lessonMetadata.estimatedTime
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error loading lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
