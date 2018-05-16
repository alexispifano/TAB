import { TABPage } from './app.po';

describe('tab App', function() {
  let page: TABPage;

  beforeEach(() => {
    page = new TABPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
