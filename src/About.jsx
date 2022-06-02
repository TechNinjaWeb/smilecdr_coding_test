import { Card, Row, Col } from 'antd';

function About() {  
  return (<div className="page about container">
    <div style={{marginBottom: 25}}>
      <h2 style={{textAlign: 'center'}}>Made with &#9825;</h2>
      <h6 style={{textAlign: 'center', wordWrap: 'break-word'}}>Thank you for giving me the opportunity to showcase my skills!</h6>
    </div>
    <hr/>
    <p style={{margin: 0}}>
      This project was made with the following tools
    </p>
    <ul style={{margin: 0}}>
      <li style={{listStyle: 'inside'}}>React: Create React App</li>
      <li style={{listStyle: 'inside'}}>Ant Design: A Design System For Enterprise-Level Products</li>
      <li style={{listStyle: 'inside'}}>FHIR: Fast Health Interoperability Resources Server</li>
    </ul>
    <hr/>
    <div style={{margin: "10px auto"}}>
      <Card title={<h3 style={{textAlign: 'center'}}>About Me: <span style={{fontSize: '.75rem'}}>Tech Ninja</span></h3>} style={{marginTop: 24}}>
        <p style={{margin: 0}}>
          I'm really into Permaculture and Natural Building Design.<br /><br />
          With a bit of care, I believe we can create products that produce waste which can be used as 
          fuel, allowing for sustainable feedback loops in the production chain.<br /><br />
        </p>
      </Card>
      <Card title={<h3 style={{textAlign: 'center'}}>Favourite Books:</h3>} style={{marginTop: 24}}>
        <Row gutter={[12, 12]}>
          <Col md={{span: 8}} xs={{span: 24}}>
            <a href="https://www.amazon.com/Short-History-Nearly-Everything/dp/076790818X" target="_blank" rel="noreferrer">
              <Card
                size="sm"
                hoverable
                style={{ height: '100%' }}
                cover={<img style={{height: 300}} alt="Bill Bryson: A Short History Of Nearly Everything" src="//images-na.ssl-images-amazon.com/images/I/41gdQTWQgEL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg" />}
              >
                <Card.Meta
                  title="A Short History Of Nearly Everything"
                  description="book that explains some areas of science, using easily accessible language that appeals more to the general public than many other books dedicated to the subject."
                />
              </Card>
            </a>
          </Col>
          <Col md={{span: 8}} xs={{span: 24}}>
            <a href="https://www.amazon.com/48-Laws-Power-Robert-Greene-ebook/dp/B0024CEZR6" target="_blank" rel="noreferrer">
              <Card
                size="sm"
                hoverable
                style={{ height: '100%' }}
                cover={<img style={{height: 300}} alt="example" src="https://m.media-amazon.com/images/I/41EhEN9nsmL.jpg" />}
              >
                <Card.Meta title="The 48 Laws of Power" description="The 48 Laws of Power is a book about the “laws” that powerful people throughout history have used to get and maintain power." />
              </Card>
            </a>
          </Col>
          <Col md={{span: 8}} xs={{span: 24}}>
            <a href="https://www.amazon.com/Charlie-Great-Glass-Elevator-Bucket-ebook/dp/B0093X80VQ" target="_blank" rel="noreferrer">
              <Card
                size="sm"
                hoverable
                style={{ height: '100%' }}
                cover={<img style={{height: 300}} alt="Charlie and the Great Glass Elevator" src="https://m.media-amazon.com/images/I/51wzU9LbImL.jpg" />}
              >
                <Card.Meta title="Charlie and the Great Glass Elevator" description="Last seen flying through the sky in a giant elevator in Charlie and the Chocolate Factory, Charlie Bucket's back for another adventure. When the giant elevator picks up speed, Charlie, Willy Wonka, and the gang are sent hurtling through space and time. " />
              </Card>
            </a>
          </Col>
        </Row>
      </Card>
    </div>
  </div>)
}

export default About;
