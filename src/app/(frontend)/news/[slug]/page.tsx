// single blog page
// app/news/[slug]/page.tsx
import NewsArticleContent from './NewsArticleContent'

const placeholderPost = {
  title: 'AYO Newsletter – July, 2026',
  author: 'Mary Lin',
  date: 'Sun. 21 June',
  heroImage: '/grey_rectangle.png',
  body: [
    {
      type: 'paragraph',
      text: 'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance. A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance. A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance. A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
    },
    {
      type: 'imagePair',
      images: ['/grey_rectangle.png', '/grey_rectangle.png'],
      caption:
        'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
    },
    {
      type: 'paragraph',
      text: 'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance. A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné,.',
    },
    {
      type: 'quote',
      text: 'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné.',
    },
    {
      type: 'paragraph',
      text: 'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance. A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné,.',
    },
    {
      type: 'image',
      src: '/grey_rectangle.png',
    },
  ],
}

const relatedPosts = [
  {
    id: 1,
    title: '2025 Soloist Competition',
    date: 'November 1st, 2025',
    image: '/grey_rectangle.png',
  },
  {
    id: 2,
    title: 'Hear Tony Yan Tong Chen on RNZ Concert',
    date: 'June 6th, 2025',
    image: '/grey_rectangle.png',
  },
  {
    id: 3,
    title: 'Howick June Concert Cancelled',
    date: 'June 6th, 2025',
    image: '/grey_rectangle.png',
  },
]

export default async function SinglePostPage() {
  return <NewsArticleContent post={placeholderPost} relatedPosts={relatedPosts} />
}
