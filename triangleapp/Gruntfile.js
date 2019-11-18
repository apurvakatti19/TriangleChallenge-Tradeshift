module.exports = function(grunt) {
grunt.initConfig({
sass: {
      dist: {
        files: {
          "dev/css/styles.css" : "src/scss/styles.scss"
        }
      }
    }
});
grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.registerTask('default', []);
};