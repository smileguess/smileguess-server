const avatars = [
  'http://cdn.photonesta.com/images/data.whicdn.com/images/127977939/original.png',
  'http://static1.squarespace.com/static/5018d08ae4b0a463fb2fc659/t/546175abe4b011fe10901497/1418889965591/?format=1500w',
  'http://25.media.tumblr.com/ddba265a8e1538d5db940f2e3c95c8ad/tumblr_n1gqwc5egi1qhcd6po1_500.gif',
  'https://lh3.googleusercontent.com/715fgXULvZkvaSfJ4G7D4TvFYcGEK2sPO0NosMh9IyD7LbXq9WqhCElbS46bDmjNXQ=w300',
  'https://chinesefontdesign.com/wp-content/uploads/2014/05/1817.gif'
];

module.exports = () => {
  return avatars[Math.floor(Math.random() * avatars.length)];
};

