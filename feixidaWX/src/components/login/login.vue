<template>
	<div class="container">
		<div class='login-title'>
			<img :src='loginImg' />
		</div>
		<form class='login-from-content'>
			<div v-for="item in form" :class='item.cla'>
				<img :src='item.src' />
				<label>{{item.lab}}</label>
				<input type="text" v-model="item.value" :placeholder='item.placeholder' />
			</div>
		</form>
		<input class="btn" type="submit" @touchstart="login" value="登录" />
	</div>
</template>
<script>
	export default {
		data() {
			return {
				loginImg: './static/image/loginImg.jpg',
				form: [{
					cla: 'text',
					src: "./static/image/text.png",
					lab: '账号',
					value: "",
					placeholder: '请输入账号'
				},
				{
					cla: 'password',
					src: "./static/image/password.png",
					lab: '密码',
					value: "",
					placeholder: '请输入密码'	
				}]
			}
		},
		methods: {
			login() {
				if(this.form[0].value != '' && this.form[1].value != '') {
					this.toLogin()
				}else {
					layer.open({content: '账号和密码不能为空！',skin: 'msg',time: 2});
				}
			},
			toLogin() {
				let _url = this.$storeUrl, name = this.form[0].value, password = this.form[1].value;
				this.$axios.post(_url.ipconfig + _url.login,{
					"username": name,
					"password": password
				}).then((response) => {
					if(response.status === 200) {
						localStorage.setItem("token","aclmain " + response.data.token)
						this.$router.push('/index')
					}
				})
			}
			
			
			
		},
		mounted() {
//			let getStorage = localStorage.getItem("token");
//			if(getStorage !== "") {
//				this.$router.push('/index')
//			}
		}
	}
</script>

<style scoped>
	@import "./login.css";
</style>