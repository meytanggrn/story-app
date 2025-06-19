// src/routes/routes.js
import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import NewStoryPage from '../pages/new-story/new-story-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page';

const routes = {
  '/': LoginPage,
  '/about': AboutPage,
  '/login': LoginPage,
  '/home': HomePage,
  '/register': RegisterPage,
  '/new-story': NewStoryPage,
  '/story-detail/:id': StoryDetailPage,
};


export default routes;
