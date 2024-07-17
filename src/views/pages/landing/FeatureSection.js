import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Typography, Stack, CardMedia } from '@mui/material';

// project imports
import FadeInWhenVisible from './Animation';
import SubCard from 'ui-component/cards/SubCard';
import Avatar from 'ui-component/extended/Avatar';

// assets
import Offer1 from 'assets/images/landing/offer/offer-1.png';
import Offer2 from 'assets/images/landing/offer/offer-2.png';
import Offer3 from 'assets/images/landing/offer/offer-3.png';
import Offer4 from 'assets/images/landing/offer/offer-4.png';
import Offer5 from 'assets/images/landing/offer/offer-5.png';
import Offer6 from 'assets/images/landing/offer/offer-6.png';

const OfferCard = ({ title, caption, image }) => {
    const theme = useTheme();
    const AvaterSx = { background: 'transparent', color: theme.palette.secondary.main, width: 56, height: 56 };
    return (
        <FadeInWhenVisible>
            <SubCard
                sx={{
                    bgcolor: theme.palette.mode === 'dark' ? 'dark.800' : 'grey.100',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.divider,
                    '&:hover': { boxShadow: 'none' },
                    height: '100%'
                }}
            >
                <Stack spacing={4}>
                    <Avatar variant="rounded" sx={AvaterSx}>
                        <CardMedia component="img" src={image} alt="Beautiful User Interface" />
                    </Avatar>
                    <Stack spacing={2}>
                        <Typography variant="h3" sx={{ fontWeight: 500 }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                            {caption}
                        </Typography>
                    </Stack>
                </Stack>
            </SubCard>
        </FadeInWhenVisible>
    );
};

OfferCard.propTypes = {
    title: PropTypes.string,
    caption: PropTypes.string,
    image: PropTypes.string
};
// =============================|| LANDING - FEATURE PAGE ||============================= //

const FeatureSection = () => (
    <Container>
        <Grid container spacing={7.5} justifyContent="center">
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
                <Grid container spacing={1.5}>
                    <Grid item xs={12}>
                        <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                            What does TechMou offer?
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                            Social Media Management, Content Create, Brand Identity, Simplify Record-keeping, Track Progress & Attendance and more!
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container justifyContent="center" spacing={5} sx={{ '&> .MuiGrid-root > div': { height: '100%' } }}>
                    <Grid item md={4} sm={6}>
                        <OfferCard
                            // title="Beautiful User Interface"
                            // caption="TechMou can improve the user experience of your web application by providing a clear and intuitive layout, and consistent look and feel."
                            title="Social Media Management"
                            caption="Our expert team will handle your social media accounts, creating engaging content, managing interactions, and analyzing performance to help your brand thrive online."
                            image={Offer1}
                        />
                    </Grid>
                    <Grid item md={4} sm={6}>
                        <OfferCard
                            // title="Time and Cost Savings"
                            // caption="TechMou can save developers time and effort by providing a pre-built user interface, allowing them to focus on other aspects of the project."
                            title="Content Creation"
                            caption="We specialize in crafting compelling content tailored to your audience, including articles, videos, infographics, and more, to elevate your brand's presence and engagement."
                            image={Offer2}
                        />
                    </Grid>
                    <Grid item md={4} sm={6}>
                        <OfferCard
                            // title="Streamlined Operations"
                            // caption="Keep users engaged with real-time notifications for easy tracking and monitoring. Techmou streamlines processes and enhances productivity."
                            title="Brand Identity & Design"
                            caption="Let us define and enhance your brand's identity with stunning visual elements, including logo design, brand guidelines, and creative assets that resonate with your target audience."
                            image={Offer3}
                        />
                    </Grid>
                    <Grid item md={4} sm={6}>
                        <OfferCard
                            title="Simplify Record-keeping"
                            caption="TechMou streamlines your record-keeping process, making it easy to organize and access important data, saving you time and reducing administrative burdens."
                            image={Offer6}
                        />
                    </Grid>
                    <Grid item md={4} sm={6}>
                        <OfferCard
                            title="Track Progress & Attendance"
                            caption="Monitor project progress and employee attendance effortlessly with TechMou's comprehensive tracking solutions, ensuring accountability and efficiency in your operations."
                            image={Offer4}
                        />
                    </Grid>
                    <Grid item md={4} sm={6}>
                        <OfferCard
                            title="Exceptional After-sales Service"
                            caption="Experience exceptional after-sales service and ongoing support. Our dedicated team is here to assist you every step of the way."
                            image={Offer5}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Container>
);

export default FeatureSection;
