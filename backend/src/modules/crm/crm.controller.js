import { getQuizRecommendations } from './crm.service.js';
import { findUserById, updateFavoriteFlavors, updateNewsletterSubscription, updateLoyaltyPoints } from '../auth/auth.repository.js';

export async function postQuiz(req, res) {
    try {
        const recommendations = getQuizRecommendations(req.body);
        return res.status(200).json({ recommendations });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export async function getLoyaltyBalance(req, res) {
    try {
        const user = await findUserById(req.user.sub);
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({
            loyaltyPoints: user.loyalty_points,
            tier: user.loyalty_points >= 5000 ? 'gold' : user.loyalty_points >= 2000 ? 'silver' : 'bronze'
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function postSaveFlavors(req, res) {
    try {
        const { flavors } = req.body;
        if (!Array.isArray(flavors)) {
            return res.status(400).json({ message: 'flavors must be an array' });
        }
        const result = await updateFavoriteFlavors(req.user.sub, flavors);
        return res.status(200).json({ favoriteFlavors: result.favorite_flavors });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function postNewsletter(req, res) {
    try {
        const { subscribe } = req.body;
        const result = await updateNewsletterSubscription(req.user.sub, !!subscribe);
        return res.status(200).json({
            message: subscribe ? 'Subscribed to exclusive offers!' : 'Unsubscribed',
            subscribed: result.newsletter_subscribed
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function redeemPoints(req, res) {
    try {
        const { points } = req.body;
        if (!points || points < 1) {
            return res.status(400).json({ message: 'points must be a positive number' });
        }
        const user = await findUserById(req.user.sub);
        if (user.loyalty_points < points) {
            return res.status(400).json({ message: 'Insufficient loyalty points' });
        }
        const result = await updateLoyaltyPoints(req.user.sub, -points);
        return res.status(200).json({
            message: `Redeemed ${points} points for early access to limited drops!`,
            remainingPoints: result.loyalty_points
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
