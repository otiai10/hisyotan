/**
 * テキストを解釈して、パターンを決定して返す
**/

var c = require('./modules/constants').constants;

exports.interpretText = function(text, is_mention, secr_name, triggers){

  if(!is_mention){
    return getTriggerPattern(text, triggers);
  }

  if(text.match(c.FLAG_HELP)){
    return c.REP_HELP
  }
  if(text.match(c.FLAG_DONE)){
    return c.REP_DONE_TASK;
  }
  if(text.match(c.FLAG_ADD)){
    return c.REP_REG_TASK;
  }
  if(text.match(c.FLAG_INIT) && text.match(c.WORD_INIT)){
    return c.REP_INIT_PARTNERSHIP;
  }
  
  return c.REP_LIST_TASK;
};

/*private*/function getTriggerPattern(text, triggers){
  for(var i in triggers){
    if(text.match(i)){
      return triggers[i];
    }
  }
  return c.IGNORE;
}

