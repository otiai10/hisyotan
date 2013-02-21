/**
 * テキストを解釈して、パターンを決定して返す
**/

var c = require('./modules/constants').constants;

exports.interpretText = function(text, is_mention, is_new_commer, triggers){

  //-----[[TRIGGER]]-----
  if(!is_mention){
    return getTriggerPattern(text, triggers);
  }

  //-----[[TASK]]-----
  else if(text.match(c.FLAG_HELP)){
    return c.REP_HELP
  }
  else if(text.match(c.FLAG_DONE)){
    return c.REP_DONE_TASK;
  }
  else if(text.match(c.FLAG_ADD)){
    return c.REP_REG_TASK;
  }

  //-----[[REMIND]]-----
  else if(text.match(c.FLAG_UPDATE_DAILY)){
    return c.REP_UPDATE_DAILY;
  }
  else if(text.match(c.FLAG_ENABLE_DAILY)){
    return c.REP_ENABLE_DAILY;
  }
  else if(text.match(c.FLAG_DISABLE_DAILY)){
    return c.REP_DISABLE_DAILY;
  }
  else if(text.match(c.FLAG_ENABLE_WEEKLY)){
    return c.REP_ENABLE_WEEKLY;
  }
  else if(text.match(c.FLAG_DISABLE_WEEKLY)){
    return c.REP_DISABLE_WEEKLY;
  }

  //-----[[PDF]]-----
  else if(text.match(c.FLAG_ENABLE_PDF)){
    return c.REP_ENABLE_PDF;
  }
  else if(text.match(c.FLAG_DISABLE_PDF)){
    return c.REP_DISABLE_PDF;
  }
  else if(text.match(c.FLAG_DEBUG_PDF)){
    return c.REP_PDF;
  }
  //-----[[INIT]]-----
  else if(text.match(c.FLAG_INIT) && text.match(c.WORD_INIT)){
    return c.REP_INIT_PARTNERSHIP;
  }
  //-----[[TERMINATE]]-----
  else if(text.match(c.FLAG_TERMINATE) && text.match(c.WORD_TERMINATE)){
    return c.REP_TERMINATE_PARTNERSHIP;
  }
 
  else if(is_new_commer){
    return c.REP_HELP;
  }

  //-----[[DEFAULT = LIST]]-----
  else{
    return c.REP_LIST_TASK;
  }
};

/*private*/function getTriggerPattern(text, triggers){
  for(var i in triggers){
    if(text.match(i)){
      return triggers[i];
    }
  }
  return c.IGNORE;
}

