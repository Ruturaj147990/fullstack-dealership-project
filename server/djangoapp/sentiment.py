import re

POSITIVE_WORDS = {
    'fantastic', 'great', 'excellent', 'amazing', 'wonderful', 'superb',
    'good', 'awesome', 'best', 'love', 'liked', 'positive', 'helpful',
    'friendly', 'recommend', 'satisfied', 'pleased', 'reliable', 'clean',
    'fast', 'smooth', 'professional', 'outstanding', 'perfect', 'exceptional'
}

NEGATIVE_WORDS = {
    'terrible', 'bad', 'horrible', 'awful', 'poor', 'worst', 'hate',
    'disappointed', 'disappointing', 'negative', 'unhelpful', 'rude',
    'slow', 'broken', 'scam', 'unreliable', 'waste', 'avoid', 'complaint',
    'problem', 'issue', 'overpriced', 'dishonest'
}

def analyze_text_sentiment(text):
    if not text:
        return 'neutral'
    
    words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
    pos_count = sum(1 for w in words if w in POSITIVE_WORDS)
    neg_count = sum(1 for w in words if w in NEGATIVE_WORDS)

    if pos_count > neg_count:
        return 'positive'
    elif neg_count > pos_count:
        return 'negative'
    return 'neutral'
