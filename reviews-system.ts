/**
 * User Reviews & Ratings System
 * Allows users to rate products and leave reviews per retailer
 */

export interface Review {
  id: string;
  productId: string;
  userId: string;
  retailer: 'Checkers' | 'Pick n Pay' | 'SPAR' | 'Woolworths' | 'OK Foods';
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  verified: boolean; // User actually purchased from this retailer
  helpful: number; // Number of helpful votes
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductRating {
  productId: string;
  retailer: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number; // 1-5 star counts
  };
  topReviews: Review[];
}

// In-memory storage (in production, use database)
const reviews: Map<string, Review> = new Map();
const productRatings: Map<string, ProductRating> = new Map();

export class ReviewsSystem {
  /**
   * Add a review for a product
   */
  public addReview(
    productId: string,
    userId: string,
    retailer: string,
    rating: number,
    title: string,
    comment: string,
    verified: boolean = false
  ): Review {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const review: Review = {
      id: `review-${Date.now()}-${Math.random()}`,
      productId,
      userId,
      retailer: retailer as any,
      rating,
      title,
      comment,
      verified,
      helpful: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    reviews.set(review.id, review);
    this.updateProductRating(productId, retailer);

    console.log(`[Reviews] ✓ Review added for product ${productId} at ${retailer}`);
    return review;
  }

  /**
   * Get reviews for a product at a specific retailer
   */
  public getReviews(productId: string, retailer?: string): Review[] {
    return Array.from(reviews.values()).filter(
      r => r.productId === productId && (!retailer || r.retailer === retailer)
    );
  }

  /**
   * Get product rating summary
   */
  public getProductRating(productId: string, retailer: string): ProductRating | null {
    const key = `${productId}-${retailer}`;
    return productRatings.get(key) || null;
  }

  /**
   * Mark review as helpful
   */
  public markHelpful(reviewId: string): boolean {
    const review = reviews.get(reviewId);
    if (!review) return false;

    review.helpful++;
    review.updatedAt = new Date();
    return true;
  }

  /**
   * Delete a review
   */
  public deleteReview(reviewId: string, userId: string): boolean {
    const review = reviews.get(reviewId);
    if (!review || review.userId !== userId) return false;

    reviews.delete(reviewId);
    this.updateProductRating(review.productId, review.retailer);
    return true;
  }

  /**
   * Update product rating summary
   */
  private updateProductRating(productId: string, retailer: string): void {
    const productReviews = this.getReviews(productId, retailer);

    if (productReviews.length === 0) {
      productRatings.delete(`${productId}-${retailer}`);
      return;
    }

    const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    productReviews.forEach(review => {
      ratingDistribution[review.rating]++;
      totalRating += review.rating;
    });

    const averageRating = Math.round((totalRating / productReviews.length) * 10) / 10;

    const rating: ProductRating = {
      productId,
      retailer,
      averageRating,
      totalReviews: productReviews.length,
      ratingDistribution,
      topReviews: productReviews
        .sort((a, b) => b.helpful - a.helpful)
        .slice(0, 5),
    };

    productRatings.set(`${productId}-${retailer}`, rating);
  }

  /**
   * Get top-rated products
   */
  public getTopRatedProducts(limit: number = 10): ProductRating[] {
    return Array.from(productRatings.values())
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit);
  }

  /**
   * Get reviews by user
   */
  public getUserReviews(userId: string): Review[] {
    return Array.from(reviews.values()).filter(r => r.userId === userId);
  }

  /**
   * Get verified reviews (from actual purchasers)
   */
  public getVerifiedReviews(productId: string, retailer: string): Review[] {
    return this.getReviews(productId, retailer).filter(r => r.verified);
  }

  /**
   * Get review statistics
   */
  public getStats() {
    return {
      totalReviews: reviews.size,
      totalProducts: new Set(Array.from(reviews.values()).map(r => r.productId)).size,
      averageRating: this.calculateGlobalAverageRating(),
      verifiedReviews: Array.from(reviews.values()).filter(r => r.verified).length,
    };
  }

  /**
   * Calculate global average rating
   */
  private calculateGlobalAverageRating(): number {
    if (reviews.size === 0) return 0;
    const totalRating = Array.from(reviews.values()).reduce((sum, r) => sum + r.rating, 0);
    return Math.round((totalRating / reviews.size) * 10) / 10;
  }

  /**
   * Get reviews with specific rating
   */
  public getReviewsByRating(productId: string, rating: number): Review[] {
    return this.getReviews(productId).filter(r => r.rating === rating);
  }

  /**
   * Get most helpful reviews
   */
  public getMostHelpfulReviews(productId: string, limit: number = 5): Review[] {
    return this.getReviews(productId)
      .sort((a, b) => b.helpful - a.helpful)
      .slice(0, limit);
  }
}

// Export singleton instance
export const reviewsSystem = new ReviewsSystem();

// Add sample reviews for testing
export function initializeSampleReviews() {
  reviewsSystem.addReview(
    'dairy-clover-1l',
    'user-1',
    'Checkers',
    5,
    'Great quality milk',
    'Always fresh and tasty. Great price at Checkers!',
    true
  );

  reviewsSystem.addReview(
    'dairy-clover-1l',
    'user-2',
    'SPAR',
    4,
    'Good value',
    'Good quality milk, slightly cheaper than Checkers',
    true
  );

  reviewsSystem.addReview(
    'meat-rainbow-chicken-1kg',
    'user-3',
    'Pick n Pay',
    5,
    'Fresh and delicious',
    'Best chicken I\'ve bought. Very fresh!',
    true
  );

  reviewsSystem.addReview(
    'meat-rainbow-chicken-1kg',
    'user-4',
    'Woolworths',
    3,
    'Average quality',
    'Not as fresh as other retailers',
    true
  );

  console.log('[Reviews] ✓ Sample reviews initialized');
}
