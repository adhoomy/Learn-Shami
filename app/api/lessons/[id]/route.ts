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

    // Use data from MongoDB (already parsed from CSV during seeding)
    const lessonData = lessonMetadata.data || [];

    // Combine metadata + data into one JSON response
    const response = {
      lessonId: parseInt(lessonId),
      title: lessonMetadata.title,
      description: lessonMetadata.description,
      difficulty: lessonMetadata.difficulty,
      tags: lessonMetadata.tags,
      totalItems: lessonData.length,
      data: lessonData,
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
