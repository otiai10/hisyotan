exports.constants = {

  'IGNORE'                  : -1,

  /* reply pattern */
  'REP_HELP'                 :  0,
  'REP_LIST_TASK'            :  1,
  'REP_REG_TASK'             :  2,
  'REP_DONE_TASK'            :  3,
  'REP_UPDATE_DAILY'         :  4,
  'REP_ENABLE_DAILY'         :  5,
  'REP_DISABLE_DAILY'        :  6,
  'REP_ENEABLE_WEEKLY'       :  7,
  'REP_DISABLE_WEEKLY'       :  8,
  'REP_INIT_PARTNERSHIP'     :  9,
  'REP_TERMINATE_PARTNERSHIP': 10,
  'REP_ENABLE_PDF'           : 11,
  'REP_DISABLE_PDF'          : 12,
  'REP_PDF'                  : 13,

  /* remind pattern */
  'REMIND_DAILY'            :101,
  'REMIND_WEEKLY'           :102,
  'REMIND_PDF'              :103,

  /* trigger pattern */
  'TRIGGER_TAIKIN'          :1001,
  'TRIGGER_OHAYO'           :1002,
  'TRIGGER_OYASUMI'         :1003,
  'TRIGGER_TSUKARETA'       :1004,

  /* FLAG */
  'FLAG_HELP'               : '--help',
  'FLAG_ADD'                : '/&',
  'FLAG_DONE'               : '--done',
  'FLAG_UPDATE_DAILY'       : '--daily-up',
  'FLAG_ENABLE_DAILY'       : '--daily-on',
  'FLAG_DISABLE_DAILY'      : '--daily-off',
  'FLAG_ENABLE_WEEKLY'      : '--weekly-on',
  'FLAG_DISABLE_WEEKLY'     : '--weekly-off',
  'FLAG_ENABLE_PDF'         : '--pdf-on',
  'FLAG_DISABLE_PDF'        : '--pdf-off',
  'FLAG_DEBUG_PDF'          : '--pdf-dbg',
  'FLAG_INIT'               : '--init',
  'WORD_INIT'               : 'よろしくね',
  'FLAG_TERMINATE'          : '--bye',
  'WORD_TERMINATE'          : 'きみとはやってられん',

  /* CLI_ARG */
  'CLI_ARG_DAILY'           : 'daily',
  'CLI_ARG_WEEKLY'          : 'weekly',
  'CLI_ARG_PDF'             : 'pdf',

  /* PDF handle */
  'CUT_TAIL'                : 200,
  'CHUNK_LEN'               : 80,
  'REMIND_PDF_PERCENTAGE'   : 1,
};
