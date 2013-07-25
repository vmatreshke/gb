#
# Сайт
#
activate :relative_assets
set :site_title, 'Высшая Школа Главбуха'

#
# Мидлмен
#

# configure :build do
#   activate :minify_javascript
#   set :js_compressor, ::Closure::Compiler.new
# end

# activate :directory_indexes

ignore 'images/sprite-*/*'
ignore 'javascripts/modules/*'
ignore 'javascripts/plugins/*'
ignore 'javascripts/script/*'

#
# Препроцессоры
#

compass_config do |config|
  config.line_comments   = false
  config.output_style    = :compressed
  config.relative_assets = true
end

set :haml, {
  :attr_wrapper => '"',
  :format       => :html5,
}