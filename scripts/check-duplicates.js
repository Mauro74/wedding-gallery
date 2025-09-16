#!/usr/bin/env node

/**
 * Wedding Photos Duplicate Checker
 * 
 * This script checks for duplicates in the wedding-photos.json file by:
 * - ID property
 * - src property (image URLs)
 * - thumbnail property (thumbnail URLs)
 * - Completely identical entries
 * 
 * Usage:
 *   node scripts/check-duplicates.js [--fix]
 * 
 * Options:
 *   --fix    Automatically remove duplicates and save cleaned data
 * 
 * Examples:
 *   node scripts/check-duplicates.js           # Check only, don't modify
 *   node scripts/check-duplicates.js --fix    # Check and remove duplicates
 */

import fs from 'fs';
import path from 'path';

const WEDDING_PHOTOS_PATH = './src/data/wedding-photos.json';

// Parse command line arguments
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');

console.log('=== WEDDING PHOTOS DUPLICATE CHECKER ===');
console.log(`File: ${WEDDING_PHOTOS_PATH}`);
console.log(`Mode: ${shouldFix ? 'CHECK & FIX' : 'CHECK ONLY'}`);
console.log('');

// Check if file exists
if (!fs.existsSync(WEDDING_PHOTOS_PATH)) {
  console.error(`❌ Error: File not found: ${WEDDING_PHOTOS_PATH}`);
  process.exit(1);
}

// Read and parse the JSON file
let data;
try {
  const fileContent = fs.readFileSync(WEDDING_PHOTOS_PATH, 'utf8');
  data = JSON.parse(fileContent);
} catch (error) {
  console.error(`❌ Error reading/parsing JSON file: ${error.message}`);
  process.exit(1);
}

console.log(`Total photos: ${data.length}`);
console.log('');

// Check for duplicate IDs
console.log('1. CHECKING FOR DUPLICATE IDs...');
const idMap = new Map();
const duplicateIds = [];

data.forEach((photo, index) => {
  if (idMap.has(photo.id)) {
    duplicateIds.push({
      original: idMap.get(photo.id),
      duplicate: { ...photo, index }
    });
  } else {
    idMap.set(photo.id, { ...photo, index });
  }
});

console.log(`Found ${duplicateIds.length} duplicate IDs`);
if (duplicateIds.length > 0) {
  duplicateIds.forEach(dup => {
    console.log(`  ⚠️  ID ${dup.duplicate.id}: first at index ${dup.original.index}, duplicate at index ${dup.duplicate.index}`);
  });
}
console.log('');

// Check for duplicate src URLs
console.log('2. CHECKING FOR DUPLICATE SRC URLs...');
const srcMap = new Map();
const duplicateSrcs = [];

data.forEach((photo, index) => {
  if (srcMap.has(photo.src)) {
    duplicateSrcs.push({
      original: srcMap.get(photo.src),
      duplicate: { ...photo, index }
    });
  } else {
    srcMap.set(photo.src, { ...photo, index });
  }
});

console.log(`Found ${duplicateSrcs.length} duplicate src URLs`);
if (duplicateSrcs.length > 0) {
  duplicateSrcs.forEach(dup => {
    console.log(`  ⚠️  SRC: ${dup.duplicate.src}`);
    console.log(`    Original: ID ${dup.original.id} at index ${dup.original.index}`);
    console.log(`    Duplicate: ID ${dup.duplicate.id} at index ${dup.duplicate.index}`);
  });
}
console.log('');

// Check for duplicate thumbnail URLs
console.log('3. CHECKING FOR DUPLICATE THUMBNAIL URLs...');
const thumbnailMap = new Map();
const duplicateThumbnails = [];

data.forEach((photo, index) => {
  if (thumbnailMap.has(photo.thumbnail)) {
    duplicateThumbnails.push({
      original: thumbnailMap.get(photo.thumbnail),
      duplicate: { ...photo, index }
    });
  } else {
    thumbnailMap.set(photo.thumbnail, { ...photo, index });
  }
});

console.log(`Found ${duplicateThumbnails.length} duplicate thumbnail URLs`);
if (duplicateThumbnails.length > 0) {
  duplicateThumbnails.forEach(dup => {
    console.log(`  ⚠️  THUMBNAIL: ${dup.duplicate.thumbnail}`);
    console.log(`    Original: ID ${dup.original.id} at index ${dup.original.index}`);
    console.log(`    Duplicate: ID ${dup.duplicate.id} at index ${dup.duplicate.index}`);
  });
}
console.log('');

// Check for entries that are completely identical (all properties match)
console.log('4. CHECKING FOR COMPLETELY IDENTICAL ENTRIES...');
const completeEntryMap = new Map();
const completelyDuplicate = [];

data.forEach((photo, index) => {
  const key = `${photo.id}-${photo.src}-${photo.thumbnail}-${photo.category}`;
  if (completeEntryMap.has(key)) {
    completelyDuplicate.push({
      original: completeEntryMap.get(key),
      duplicate: { ...photo, index }
    });
  } else {
    completeEntryMap.set(key, { ...photo, index });
  }
});

console.log(`Found ${completelyDuplicate.length} completely identical entries`);
if (completelyDuplicate.length > 0) {
  completelyDuplicate.forEach(dup => {
    console.log(`  ⚠️  Complete duplicate: ID ${dup.duplicate.id} at index ${dup.duplicate.index}`);
  });
}
console.log('');

// Summary
const totalDuplicates = duplicateIds.length + duplicateSrcs.length + duplicateThumbnails.length + completelyDuplicate.length;
console.log('=== SUMMARY ===');
console.log(`Total duplicate issues found: ${totalDuplicates}`);
console.log(`- Duplicate IDs: ${duplicateIds.length}`);
console.log(`- Duplicate src URLs: ${duplicateSrcs.length}`);
console.log(`- Duplicate thumbnail URLs: ${duplicateThumbnails.length}`);
console.log(`- Completely identical entries: ${completelyDuplicate.length}`);

if (totalDuplicates === 0) {
  console.log('✅ NO DUPLICATES FOUND - Data is clean!');
  process.exit(0);
}

console.log('⚠️  DUPLICATES FOUND');

if (!shouldFix) {
  console.log('');
  console.log('💡 To automatically fix duplicates, run:');
  console.log('   node scripts/check-duplicates.js --fix');
  process.exit(1);
}

// Fix duplicates if --fix flag is provided
console.log('\n=== CLEANING DATA ===');

const seenIds = new Set();
const seenSrcs = new Set();
const seenThumbnails = new Set();
const cleanedData = [];
let removedCount = 0;

data.forEach((photo, index) => {
  const isDuplicateId = seenIds.has(photo.id);
  const isDuplicateSrc = seenSrcs.has(photo.src);
  const isDuplicateThumbnail = seenThumbnails.has(photo.thumbnail);
  
  if (isDuplicateId || isDuplicateSrc || isDuplicateThumbnail) {
    console.log(`🗑️  Removing duplicate at index ${index}: ID ${photo.id}`);
    if (isDuplicateId) console.log(`    - Duplicate ID: ${photo.id}`);
    if (isDuplicateSrc) console.log(`    - Duplicate src: ${photo.src}`);
    if (isDuplicateThumbnail) console.log(`    - Duplicate thumbnail: ${photo.thumbnail}`);
    removedCount++;
  } else {
    seenIds.add(photo.id);
    seenSrcs.add(photo.src);
    seenThumbnails.add(photo.thumbnail);
    cleanedData.push(photo);
  }
});

console.log(`\nRemoved ${removedCount} duplicate entries`);
console.log(`Original count: ${data.length}`);
console.log(`Cleaned count: ${cleanedData.length}`);

// Create backup before overwriting
const backupPath = `${WEDDING_PHOTOS_PATH}.backup.${Date.now()}`;
try {
  fs.copyFileSync(WEDDING_PHOTOS_PATH, backupPath);
  console.log(`📋 Backup created: ${backupPath}`);
} catch (error) {
  console.error(`⚠️  Warning: Could not create backup: ${error.message}`);
}

// Write cleaned data back to file
try {
  fs.writeFileSync(WEDDING_PHOTOS_PATH, JSON.stringify(cleanedData, null, 2));
  console.log('\n✅ Cleaned data written to wedding-photos.json');
  
  // Verify the cleaned data
  console.log('\n=== VERIFICATION ===');
  const verifyIds = new Set();
  const verifySrcs = new Set();
  const verifyThumbnails = new Set();
  let verifyDuplicates = 0;
  
  cleanedData.forEach(photo => {
    if (verifyIds.has(photo.id) || verifySrcs.has(photo.src) || verifyThumbnails.has(photo.thumbnail)) {
      verifyDuplicates++;
    } else {
      verifyIds.add(photo.id);
      verifySrcs.add(photo.src);
      verifyThumbnails.add(photo.thumbnail);
    }
  });
  
  if (verifyDuplicates === 0) {
    console.log('✅ Verification passed - No duplicates remaining');
  } else {
    console.log(`❌ Verification failed - ${verifyDuplicates} duplicates still found`);
  }
  
} catch (error) {
  console.error(`❌ Error writing cleaned data: ${error.message}`);
  process.exit(1);
}
