
 const Home = { template: `<v-content>
<v-container fill-height>
        <v-layout  
        justify-center
        row
        wrap
        align-center>
                <v-flex
                    py-3
                 text-xs-center
                 xs6 offset-xs0
                 
                 >
                   <h3 class="display-1 my-4">
              Wladimir Hernández
              </h3>
              <span  class="subheading">
               Desarrollador Frontend
                </span>
                <v-divider class="my-4"></v-divider>
                <v-layout align-center justify-space-around>
                  <v-btn flat icon color="grey darken-1" href="https://www.facebook.com/wladimir.hernandez.3139" target="_blank">
                    <v-icon>fab fa-facebook-f</v-icon>
                  </v-btn>      

                  <v-btn flat icon color="grey darken-1" href="https://www.twitter.com/@wladimirdev" target="_blank">
                    <v-icon>fab fa-twitter</v-icon>
                  </v-btn>  
                  
                  <v-btn flat icon color="grey darken-1" href="https://www.youtube.com/channel/UCR50UcDCPvh7NIG6FeOgDtg" target="_blank">
                    <v-icon>fab fa-youtube</v-icon>
                  </v-btn>  
                    
                        <v-btn flat icon color="grey darken-1" href="https://github.com/wladimirhernandez" target="_blank">
                          <v-icon>fab fa-github</v-icon>
                        </v-btn>  
                          </v-layout>
                </v-flex>
                </v-layout>
      </v-container>
</v-content>` }
  const Portfolio= { template: `<v-content>
<v-container fill-height>
        <v-layout  
        justify-center
        row
        wrap
        align-center>
                <v-flex
                    py-3
                 text-xs-center
                 xs6 offset-xs0
                 
                 >
                 <v-card text-xs-center>
                 <v-img
                   src="wladimirhernandez.github.io/assets/img/alimentatunegocio.png"
                   height="auto"
                 >
                 </v-img>
         
                 <v-card-title primary-title>
                   <div>
                     <div class="headline display-1"">Alimenta Tu Negocio</div>
                    <v-tooltip bottom>
                     <v-icon slot="activator" color="orange darken-2">fab fa-html5</v-icon>
                     <span>HTML5</span>
                     </v-tooltip>
                     <v-tooltip bottom>
                      <v-icon slot="activator"color="light-blue accent-4">fab fa-css3-alt</v-icon>
                      <span>CSS3</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                       <v-icon slot="activator" color="yellow accent-4">fab fa-js</v-icon>
                       <span>JavaScript</span>
                       </v-tooltip>
                   </div>
                 </v-card-title>
         
                 <v-card-actions>
                   <v-btn flat href="http://alimentatunegocio.cl/">Visitar</v-btn>
                   <v-spacer></v-spacer>
                 </v-card-actions>
               </v-card>
                </v-flex>
                </v-layout>
      </v-container>
</v-content>` }

  const About= { template: `<v-content>
<v-container fill-height>
        <v-layout  
        justify-center
        row
        wrap
        align-center>
                <v-flex
                    py-3
                 text-xs-center
                 xs6 offset-xs0
                 
                 >
                   <h3 class="display-1 my-4">
              En Desarrollo
              </h3>
                </v-flex>
                </v-layout>
      </v-container>
</v-content>` }


  const routes = [
  { path: '/', component: Home },
  { path: '/portfolio', component: Portfolio },
  { path: '/about', component: About }
  ]

  const router = new VueRouter({
  routes
  })

  

    const app = new Vue({
      router,
      data: {
        drawer: false,
        items: [
          { title: 'Home', icon: 'home', to: '/' },
          { title: 'Portafolio', icon: 'playlist_add_check', to: '/portfolio' },
          { title: 'Sobre mí', icon: 'person', to: '/about'},
        ]
      },
      methods: {
        toggleDrawer(){
            this.drawer = !this.drawer;
          }
        },
    }).$mount('#app')
  
  
