// material-ui
import { useTheme } from '@mui/material/styles';
import logoDark from 'assets/images/logo-dark.svg';
import logo from 'assets/images/logo.svg';
import logo2 from 'assets/images/logo.vectornator.png';
import logoFrosk from 'assets/images/logo.jpg';

const Logo = () => {
    const theme = useTheme();

    return <img src={logoFrosk} alt="Frosk" width="100" />;
};

export default Logo;
