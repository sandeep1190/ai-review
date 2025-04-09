import { useLocation, Link } from 'react-router-dom';

const Header = () => {
    const location = useLocation();

    const getPageTitle = (pathname) => {
        switch(pathname) {
            case '/':
                return 'Reviews';
            case '/locations':
                return 'Locations';
            default:
                return 'Reviews';
        }
    };

    const pageTitle = getPageTitle(location.pathname);

    return (
        <header>
            <h1>{pageTitle}</h1>
            <div className="breadcrumb">
                {location.pathname !== '/' && (
                    <>
                        <Link to="/">Reviews</Link>
                        <span> / </span>
                    </>
                )}
                <span>{pageTitle}</span>
            </div>
        </header>
    );
};

export default Header;