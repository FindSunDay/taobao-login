const path = require('path');
const config = require('config');
const puppeteer = require('puppeteer');
const Rembrandt = require('rembrandt');

// const {
//   js1,
//   // js2,
//   js3,
//   js4,
//   js5
// } = require('./exec')

const TAOBAO_URI = 'https://passport.ctrip.com/user/login?BackUrl=https%3A%2F%2Fwww.ctrip.com%2F#ctm_ref=c_ph_login_buttom'
const login = async (browser, username, password) => {
  const page = await browser.newPage();

  page.setViewport({
    width: 1376,
    height: 1376
  });

  await page.goto(TAOBAO_URI, {
    waitUntil: 'networkidle2'
  });

  // await page.evaluate(js1)
  // await page.waitFor(1000 + Math.floor(Math.random() * 1000));
  // await page.evaluate(js3)
  
  // await page.waitFor(1000 + Math.floor(Math.random() * 1000));
  
  // await page.evaluate(js4)
  // await page.waitFor(1000 + Math.floor(Math.random() * 1000));
  
  // await page.evaluate(js5)
  // await page.waitFor(1000 + Math.floor(Math.random() * 1000));

  // await page.click('#J_Quick2Static');

  // await page.waitFor(Math.floor(Math.random() * 500) * Math.floor(Math.random() * 10));
  const opts = {
    delay: 2 + Math.floor(Math.random() * 2), //每个字母之间输入的间隔
  }
  await page.tap('#nloginname');
  await page.type('#nloginname', username, opts);

  await page.waitFor(3000);

  await page.tap('#npwd');
  await page.type('#npwd', password, opts);

  await page.tap('.agreement-checkbox')

  await page.screenshot({
    'path': path.join(__dirname, 'screenshots', 'login.png')
  })

  // const slider = await page.$eval('#nocaptcha', node => node.style);
  // if (slider && Object.keys(slider).length) {
  //   await page.screenshot({
  //     'path': path.join(__dirname, 'screenshots', 'login-slide.png')
  //   })

  //   await mouseSlide(page)
  // }

  await page.waitFor(1000 + Math.floor(Math.random() * 2000));
  let loginBtn = await page.$('#nsubmit')
  await loginBtn.click({
    delay: 20
  })

  await page.waitFor(20)
  await page.waitForNavigation()
  const error = await page.$eval('.error', node => node.textContent)
  if (error) {
    console.log('确保账户安全重新入输入');
    process.exit(1)
  }
  return true;
}

const loginTrip = async (browser, username, password) => {
  const loginURL = 'https://hk.trip.com/account/signin?locale=zh-HK&currency=HKD&language=HK&backurl=https%3A%2F%2Fhk.trip.com%2Forder%2Fall&responseMethod=get';
  const page = await browser.newPage();

  page.setViewport({
    width: 1376,
    height: 1376
  });

  await page.goto(loginURL, {
    //consider navigation finished when there are no more than 2 network connections for at least 500 ms.
    waitUntil: 'networkidle2'
  });

  await page.waitFor(Math.floor(Math.random() * 500) * Math.floor(Math.random() * 10));
  const opts = {
    delay: 20 + Math.floor(Math.random() * 2), //每个字母之间输入的间隔
  }

  // await page.tap('.mc-hd__login-btn');
  // await page.waitForNavigation();

  await page.tap('.r_input');
  await page.type('.one_txt_cut', username, opts);

  await page.waitFor(2000);

  await page.tap('#ibu_login_submit');

  await page.waitFor(1000);
  await page.waitForSelector('.one_txt_cut');

  await page.tap('#ibu_login_input_eye_show');
  await page.tap('input[type="password"]');
  await page.type('input[type="password"]', password, opts);

  await page.waitFor(200);

  let loginBtn = await page.$('#ibu_login_submit')
  await loginBtn.click({
    delay: 20
  })

  await page.waitFor(20)
  await page.waitForNavigation()
  const error = await page.$('.s_error_tips');
  if (error) {
    console.log('确保账户安全重新入输入');
    process.exit(1)
  }
  return true;
}

const startServer = async () => {
  try {
    const pathToExtension = path.join(__dirname, 'chrome-mac/Chromium.app/Contents/MacOS/Chromium');
    const width = 1376;
    const height = 1376;
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        `--window-size=${ width },${ height }`,
        // '--no-sandbox'
      ],
      // executablePath: pathToExtension
    });
    browser.userAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299');
    const {
      username,
      password
    } = config.taobao;
    await loginTrip(browser, username, password)
    // browser.close()
  } catch (error) {
    console.error('error', error)
  }
}

const mouseSlide = async (page) => {
  let bl = false
  while (!bl) {
    try {
      await page.hover('#nc_1_n1z')
      await page.mouse.down()
      await page.mouse.move(2000, 0, {
        'delay': 1000 + Math.floor(Math.random() * 1000)
      })
      await page.mouse.up()

      slider_again = await page.$eval('.nc-lang-cnt', node => node.textContent)
      console.log('slider_again', slider_again)
      if (slider_again != '验证通过') {
        bl = false;
        await page.waitFor(1000 + Math.floor(Math.random() * 1000));
        break;
      }
      await page.screenshot({
        'path': path.join(__dirname, 'screenshots', 'result.png')
      })
      console.log('验证通过')
      return 1
    } catch (e) {
      console.log('error :slide login False', e)
      bl = false;
      break;
    }
  }
}


startServer()