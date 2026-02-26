const campaigns = require("../data/campaigns");


const VALID_NICHES = ["Crypto", "Finance", "Tech", "Lifestyle", "Gaming", "Fashion", "Health"];
const VALID_PLATFORMS = ["X", "TikTok", "Instagram", "YouTube"];
const VALID_STATUSES = ["active", "paused", "completed"];
const VALID_SORTS = ["newest", "oldest", "budget_high", "budget_low", "views_high", "views_low"];

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function getCampaigns(req, res) {
    try {
        const q = req.query;

        const errors = [];

        // niche
        if (q.niche && !VALID_NICHES.includes(q.niche)) {
            errors.push(`Invalid niche "${q.niche}". Allowed: ${VALID_NICHES.join(", ")}.`);
        }

        // platform
        if (q.platform && !VALID_PLATFORMS.includes(q.platform)) {
            errors.push(`Invalid platform "${q.platform}". Allowed: ${VALID_PLATFORMS.join(", ")}.`);
        }

        // status
        if (q.status && !VALID_STATUSES.includes(q.status)) {
            errors.push(`Invalid status "${q.status}". Allowed: ${VALID_STATUSES.join(", ")}.`);
        }

        // sort
        if (q.sort && !VALID_SORTS.includes(q.sort)) {
            errors.push(`Invalid sort "${q.sort}". Allowed: ${VALID_SORTS.join(", ")}.`);
        }

        // page
        const page = parseInt(q.page, 10) || DEFAULT_PAGE;
        if (q.page !== undefined && (isNaN(parseInt(q.page, 10)) || parseInt(q.page, 10) < 1)) {
            errors.push(`"page" must be a positive integer. Got: "${q.page}".`);
        }

        // limit
        const limit = Math.min(parseInt(q.limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
        if (q.limit !== undefined && (isNaN(parseInt(q.limit, 10)) || parseInt(q.limit, 10) < 1)) {
            errors.push(`"limit" must be a positive integer. Got: "${q.limit}".`);
        }

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        let results = [...campaigns];

        if (q.search) {
            const term = q.search.toLowerCase().trim();
            results = results.filter(
                (c) =>
                    c.title.toLowerCase().includes(term) ||
                    c.brand.toLowerCase().includes(term) ||
                    c.tags.some((t) => t.toLowerCase().includes(term))
            );
        }

        if (q.niche) results = results.filter((c) => c.niche === q.niche);
        if (q.platform) results = results.filter((c) => c.platforms.includes(q.platform));
        if (q.status) results = results.filter((c) => c.status === q.status);

        const sort = q.sort || "newest";

        const sorters = {
            newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            budget_high: (a, b) => b.budget - a.budget,
            budget_low: (a, b) => a.budget - b.budget,
            views_high: (a, b) => b.views - a.views,
            views_low: (a, b) => a.views - b.views,
        };

        results.sort(sorters[sort]);

        const total = results.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const safePage = Math.min(Math.max(1, page), totalPages);
        const offset = (safePage - 1) * limit;
        const data = results.slice(offset, offset + limit);

        return res.json({
            success: true,
            pagination: {
                total,
                page: safePage,
                limit,
                totalPages,
                hasNextPage: safePage < totalPages,
                hasPrevPage: safePage > 1,
            },
            count: data.length,
            data,
        });

    } catch (err) {
        console.log(err)
    }
}

module.exports = getCampaigns;