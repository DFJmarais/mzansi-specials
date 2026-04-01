import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Review {
  id: number;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

interface StoreRatingsProps {
  storeName: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

export const StoreRatings = ({
  storeName,
  averageRating,
  totalReviews,
  reviews,
}: StoreRatingsProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleSubmitReview = () => {
    // Handle review submission
    console.log({ rating: newRating, title: newTitle, comment: newComment });
    setShowReviewForm(false);
    setNewRating(5);
    setNewTitle('');
    setNewComment('');
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: Math.floor(totalReviews * (Math.random() * 0.3 + 0.1)),
  }));

  return (
    <div className="w-full space-y-6">
      {/* Rating Summary */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(averageRating)
                      ? 'fill-accent text-accent'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Based on {totalReviews} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-2 space-y-2">
            {ratingDistribution.map(({ rating, count }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm font-medium w-8">{rating}★</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${(count / totalReviews) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Write Review Button */}
      <Button
        onClick={() => setShowReviewForm(!showReviewForm)}
        className="w-full gap-2 bg-primary hover:bg-primary/90"
      >
        <MessageSquare className="w-4 h-4" />
        Write a Review
      </Button>

      {/* Review Form */}
      {showReviewForm && (
        <Card className="p-6 border-2 border-primary/30 bg-primary/5">
          <h3 className="font-semibold text-foreground mb-4">Share Your Experience at {storeName}</h3>

          <div className="space-y-4">
            {/* Rating Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setNewRating(rating)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        rating <= newRating
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
              <input
                type="text"
                placeholder="Summarize your experience..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Comment</label>
              <Textarea
                placeholder="Share your detailed experience..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-24 border-border"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReview}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Submit Review
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Recent Reviews</h3>

        {reviews.map((review) => (
          <Card key={review.id} className="p-4 border-2 border-border hover:border-primary/30 transition-all">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{review.title}</h4>
                    {review.verified && (
                      <Badge className="bg-green-100 text-green-700 text-xs border-0">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-accent text-accent'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">by {review.author}</p>
              </div>

              {/* Comment */}
              <p className="text-sm text-foreground">{review.comment}</p>

              {/* Helpful */}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs"
                >
                  <ThumbsUp className="w-3 h-3" />
                  Helpful ({review.helpful})
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Mock reviews data
export const generateMockReviews = (): Review[] => [
  {
    id: 1,
    author: 'Sarah M.',
    rating: 5,
    title: 'Great prices and friendly staff',
    comment: 'Always find good deals here. The staff is helpful and the store is clean.',
    date: '2 days ago',
    helpful: 24,
    verified: true,
  },
  {
    id: 2,
    author: 'John K.',
    rating: 4,
    title: 'Good selection but sometimes crowded',
    comment: 'Wide variety of products and competitive prices. Gets busy on weekends though.',
    date: '1 week ago',
    helpful: 12,
    verified: true,
  },
  {
    id: 3,
    author: 'Thandi N.',
    rating: 5,
    title: 'Best store in the area',
    comment: 'Consistently low prices and fresh produce. Highly recommend!',
    date: '2 weeks ago',
    helpful: 31,
    verified: true,
  },
];
