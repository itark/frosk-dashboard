import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, List, Typography } from '@mui/material';

// project imports
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';
import { useDataSource } from 'store/DataSourceContext';

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
    const theme = useTheme();
    const { source } = useDataSource();

    // menu list collapse & items — an entry may declare `sources: [...]` in
    // menu-items to restrict itself to certain backends (e.g. "Kraken Konto"
    // only exists on the kraken-futures process); entries without the field
    // show for every source.
    const items = item.children
        ?.filter((menu) => !menu.sources || menu.sources.includes(source))
        .map((menu) => {
            switch (menu.type) {
                case 'collapse':
                    return <NavCollapse key={menu.id} menu={menu} level={1} />;
                case 'item':
                    return <NavItem key={menu.id} item={menu} level={1} />;
                default:
                    return (
                        <Typography key={menu.id} variant="h6" color="error" align="center">
                            Menu Items Error
                        </Typography>
                    );
            }
        });

    return (
        <>
            <List
                subheader={
                    item.title && (
                        <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
                            {item.title}
                            {item.caption && (
                                <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                                    {item.caption}
                                </Typography>
                            )}
                        </Typography>
                    )
                }
            >
                {items}
            </List>

            {/* group divider */}
            <Divider sx={{ mt: 0.25, mb: 1.25 }} />
        </>
    );
};

NavGroup.propTypes = {
    item: PropTypes.object
};

export default NavGroup;
