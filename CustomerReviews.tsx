import { Star, ThumbsUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export const CustomerReviews = () => {
  const reviews: Review[] = [
    {
      id: 1,
      author: 'Thabo M.',
      rating: 5,
      text: 'Best beef steak I\'ve bought in months! Perfect quality and the price was unbeatable. Already planning to buy more for this weekend\'s braai!',
      date: '2 days ago',
      verified: true,
      helpful: 24,
    },
    {
      id: 2,
      author: 'Nomsa K.',
      rating: 5,
      text: 'Fresh, tender, and absolutely delicious. My family loved it. This deal is incredible - saved so much money!',
      date: '1 week ago',
      verified: true,
      helpful: 18,
    },
    {
      id: 3,
      author: 'Johan P.',
      rating: 4,
      text: 'Great quality meat. Cooked it perfectly for a family dinner. Only minor issue with packaging, but the product itself is excellent.',
      date: '2 weeks ago',
      verified: true,
      helpful: 12,
    },
  ];

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const fiveStarCount = reviews.filter(r => r.rating === 5).length;

  return (
    <div className="w-full space-y-6">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Average Rating */}
        <Card className="p-6 border-2 border-border">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <p className="text-4xl font-bold text-yellow-500">{averageRating}</p>
              <div className="flex gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(parseFloat(averageRating))
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground mb-2">Based on {reviews.length} verified reviews</p>
              <p className="text-sm text-muted-foreground">{fiveStarCount} customers gave 5 stars</p>
              <Badge className="mt-3 bg-green-100 text-green-700 border-0">Highly Rated</Badge>
            </div>
          </div>
        </Card>

        {/* Trust Indicators */}
        <Card className="p-6 border-2 border-green-200 bg-green-50">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="text-2xl">✓</span>
            Why Customers Love This Deal
          </h3>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Premium quality guaranteed</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Fresh from trusted supplier</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Perfect for special occasions</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
          <span>Customer Reviews</span>
          <Badge className="bg-blue-100 text-blue-700 border-0">{reviews.length}</Badge>
        </h3>

        {reviews.map((review) => (
          <Card key={review.id} className="p-4 border-2 border-border hover:border-yellow-500 transition-all">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-foreground">{review.author}</p>
                  {review.verified && (
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs">Verified Purchase</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Review Text */}
            <p className="text-sm text-foreground mb-3 leading-relaxed">{review.text}</p>

            {/* Helpful Button */}
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ThumbsUp className="w-3 h-3" />
              <span>Helpful ({review.helpful})</span>
            </button>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <Card className="p-4 bg-blue-50 border-2 border-blue-200 text-center">
        <p className="text-sm text-foreground mb-3">Have you purchased this deal? Share your experience!</p>
        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
          Write a Review
        </button>
      </Card>
    </div>
  );
};
