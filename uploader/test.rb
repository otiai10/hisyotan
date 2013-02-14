require 'rubygems'
require 'pdf/reader'
#require 'pp'

# instanciate
reader = PDF::Reader.new('sample2.pdf')

# pdf output
#puts reader.pdf_version
#puts reader.info
#puts reader.page_count

# read and output for each page
reader.pages.each do |page|
  puts page.text
end

# test.rb | sed 's/ //g' | tr -d \\n | cut -C1000-1500
