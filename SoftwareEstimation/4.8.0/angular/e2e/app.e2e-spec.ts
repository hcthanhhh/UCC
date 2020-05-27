import { SoftwareEstimationTemplatePage } from './app.po';

describe('SoftwareEstimation App', function() {
  let page: SoftwareEstimationTemplatePage;

  beforeEach(() => {
    page = new SoftwareEstimationTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
