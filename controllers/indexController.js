/**
 * Index Controller
 * Handles HTTP requests for the home page
 */

class IndexController {
  /**
   * Render home page
   * GET /
   */
  getHomePage(req, res) {
    res.render('index', { title: 'Running App' });
  }
}

module.exports = new IndexController();

