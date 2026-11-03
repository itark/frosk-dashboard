// assets
import { IconBrandChrome, IconHelp, IconHandRock, IconRocket, IconTrendingUp, IconWallet, IconClock, IconBuildingBank, IconCoin } from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconHelp, IconHandRock, IconRocket, IconTrendingUp, IconWallet, IconClock, IconBuildingBank, IconCoin };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'sample-docs-roadmap',
    type: 'group',
    children: [
        // {
        //     id: 'sample-page',
        //     title: 'Sample Page',
        //     type: 'item',
        //     url: '/sample-page:id',
        //     icon: icons.IconBrandChrome,
        //     breadcrumbs: false
        // },
        {
            id: 'strategies-page',
            title: 'Strategies',
            type: 'item',
            url: '/strategies-page',
            icon: icons.IconRocket,
            breadcrumbs: false
        },
        {
            id: 'frosk-page',
            title: 'Securities',
            type: 'item',
            url: '/frosk-page',
            icon: icons.IconHandRock,
            breadcrumbs: false
        },
        {
            id: 'portfolio-page',
            title: 'Portfolio',
            type: 'item',
            url: '/portfolio-page',
            icon: icons.IconWallet,
            breadcrumbs: false
        },
        {
            id: 'intraday-strategies-page',
            title: 'Intraday',
            type: 'item',
            url: '/intraday-strategies-page',
            icon: icons.IconClock,
            breadcrumbs: false
        },
        {
            // Reads the Kraken Futures process on :8082 only — `sources` keeps it out
            // of the menu for the equity and Coinbase sources (see NavGroup).
            id: 'kraken-account-page',
            title: 'Kraken Konto',
            type: 'item',
            url: '/kraken-account-page',
            icon: icons.IconBuildingBank,
            breadcrumbs: false,
            sources: ['kraken-futures']
        },
        {
            // Reads the Coinbase (crypto) process on :8081 only — `sources` keeps it
            // out of the menu for the equity and Kraken Futures sources (see NavGroup).
            id: 'coinbase-account-page',
            title: 'Coinbase Konto',
            type: 'item',
            url: '/coinbase-account-page',
            icon: icons.IconCoin,
            breadcrumbs: false,
            sources: ['crypto']
        },
        {
            id: 'index-page',
            title: 'Index',
            type: 'item',
            url: '/index-page',
            icon: icons.IconTrendingUp,
            breadcrumbs: false
        },
        // {
        //     id: 'documentation',
        //     title: 'Documentation',
        //     type: 'item',
        //     url: 'https://codedthemes.gitbook.io/berry/',
        //     icon: icons.IconHelp,
        //     external: true,
        //     target: true
        // }
    ]
};

export default other;
