// assets
import { IconBrandChrome, IconHelp, IconHandRock, IconRocket } from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconHelp, IconHandRock, IconRocket };

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
