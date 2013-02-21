
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
    title: '秘書たんPDFうpろだー',
    mess : '',
  });
};
