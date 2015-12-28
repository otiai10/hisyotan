FROM ruby:2.2.3

MAINTAINER otiai10 <otiai10@gmail.com>

ADD . /workspace/hisyotan
WORKDIR /workspace/hisyotan
RUN bundle install

ENTRYPOINT bundle exec ruby main.rb
