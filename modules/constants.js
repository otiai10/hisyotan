exports.constants = {

  'IGNORE'                  : -1,

  /* reply pattern */
  'REP_HELP'                :  0,
  'REP_LIST_TASK'           :  1,
  'REP_REG_TASK'            :  2,
  'REP_DONE_TASK'           :  3,
  'REP_UPDATE_DAILY'        :  4,
  'REP_ENEABLE_DAILY'       :  5,
  'REP_DISABLE_DAILY'       :  6,
  'REP_ENEABLE_WEEKLY'      :  7,
  'REP_DISABLE_WEEKLY'      :  8,

  /* remind pattern */
  'REMIND_DAILY'            :101,
  'REMIND_WEEKLY'           :102,

  /* trigger pattern */
  'TRIGGER_TAIKIN'          :1001,
  'TRIGGER_OHAYO'           :1002,
  'TRIGGER_OYASUMI'         :1003,
  'TRIGGER_TSUKARETA'       :1004,

  /* FLAG */
  'FLAG_HELP'               : '--help',
  'FLAG_ADD'                : '/&',
  'FLAG_DONE'               : '--done',
  'FLAG_UPDATE_DAILY'       : '--daily-update',
  'FLAG_ENABLE_DAILY'       : '--daily-on',
  'FLAG_DISABLE_DAILY'      : '--daily-off',
  'FLAG_ENABLE_WEEKLY'      : '--weekly-on',
  'FLAG_DISABLE_WEEKLY'     : '--weekly-off',
  'FLAG_INIT'               : '--init',
  'WORD_INIT'               : 'よろしくね',

  /* CLI_ARG */
  'CLI_ARG_DAILY'           : 'daily',
  'CLI_ARG_WEEKLY'          : 'weekly',
};
