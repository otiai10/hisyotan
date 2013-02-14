/*
 * routes for /upload
**/

var mngs = require('../../modules/mongoose').mngs,
    fs   = require('fs'),
   _res  = {},
    mess = '';
/*
 * POST /upload 
 */
exports.file = function(req, res){
  _res = res;
  checkMaster(req.body.user,function(name){
    if(!name){
      mess = 'Twitter名' + req.body.user + 'さんは、秘書たんと友達になってないようです';
      react(mess);
    }
    else{
      if(req.files.file == void 0 || req.files.file.type == void 0 || req.files.file.path == void 0){
        mess = 'ファイルは必須です';
        react(mess);
      }
      else if(!checkFormat(req.files.file.type)){
        mess = '不正なファイル形式です？PDFがよい';
        react(mess);
      }
      else {
        tmpPath    = req.files.file.path;
        targetPath = '/var/www/hisyotan/src/pdf/' + name + '.pdf';
        fs.rename(tmpPath, targetPath, function(err){
          if(err){
            mess = 'アップロードに失敗しますた';
            console.log(err);
          }else{
            url  = 'http://otiai10.com/hisyotan/src/pdf/' + name + '.pdf';
            mess = 'アップロード成功 => <a href="' + url + '" target="_blank">' + url + '</a>';
          }
          react(mess);
        });
      }
    }
  });
};

/*
 * @return: String or false
**/
function checkMaster(name, cb){
  mngs.findMasterByName(name,function(res){
    if(res){
      cb(res.name);
    }else{
      cb(false);
    }
  });
}

/*
 * @return: boolean
**/
function checkFormat(fileType){
  if(fileType === 'application/pdf'){
    return true;
  }
  return false;
}

function react(mess){
  if(mess == void 0){
    mess = '';
  }
  _res.render('index', {
    title: '秘書たんPDFうpろだー',
    mess : mess,
  });
  tweet(mess);
}

function tweet(mess){
  // TODO
  console.log(mess);
}
