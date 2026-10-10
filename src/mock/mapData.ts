// ==========================================
// 简化版中国地图 GeoJSON 数据
// 使用简化的省份边界，仅用于演示
// ==========================================

/**
 * 获取简化版中国省份 GeoJSON
 * 注意：这是简化版数据，仅包含省份的大致轮廓
 * 如需精确地图，请替换为完整的 GeoJSON 文件
 */
export function getChinaGeoJSON() {
  return {
    type: 'FeatureCollection',
    features: [
      createProvince('北京', 116.4, 39.9, 1.5),
      createProvince('天津', 117.2, 39.1, 1.2),
      createProvince('上海', 121.5, 31.2, 1.0),
      createProvince('重庆', 106.5, 29.5, 2.5),
      createProvince('河北', 114.5, 38.0, 4.0),
      createProvince('河南', 113.7, 34.8, 3.5),
      createProvince('云南', 102.7, 25.0, 4.5),
      createProvince('辽宁', 123.4, 41.8, 4.0),
      createProvince('黑龙江', 126.6, 45.7, 5.0),
      createProvince('湖南', 112.9, 28.2, 3.5),
      createProvince('安徽', 117.3, 31.8, 3.0),
      createProvince('山东', 117.0, 36.7, 3.5),
      createProvince('新疆', 87.6, 43.8, 8.0),
      createProvince('江苏', 118.8, 32.1, 2.5),
      createProvince('浙江', 120.2, 30.3, 2.5),
      createProvince('江西', 115.9, 28.7, 3.0),
      createProvince('湖北', 114.3, 30.6, 3.5),
      createProvince('广西', 108.3, 22.8, 3.5),
      createProvince('甘肃', 103.8, 36.1, 5.0),
      createProvince('山西', 112.5, 37.9, 3.0),
      createProvince('内蒙古', 111.7, 40.8, 6.0),
      createProvince('陕西', 108.9, 34.3, 3.5),
      createProvince('吉林', 125.3, 43.9, 4.0),
      createProvince('福建', 119.3, 26.1, 2.5),
      createProvince('贵州', 106.7, 26.6, 3.0),
      createProvince('广东', 113.3, 23.1, 3.0),
      createProvince('青海', 101.8, 36.6, 5.0),
      createProvince('西藏', 91.1, 29.6, 7.0),
      createProvince('四川', 104.1, 30.7, 4.5),
      createProvince('宁夏', 106.3, 38.5, 2.0),
      createProvince('海南', 110.3, 20.0, 1.5),
      createProvince('台湾', 121.0, 23.5, 1.5),
      createProvince('香港', 114.2, 22.3, 0.8),
      createProvince('澳门', 113.5, 22.2, 0.6)
    ]
  }
}

/**
 * 创建简化的省份 GeoJSON Feature
 * 使用正六边形近似省份形状
 */
function createProvince(name: string, lng: number, lat: number, size: number) {
  const points: [number, number][] = []
  const sides = 6
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 6
    const x = lng + size * Math.cos(angle) * (0.8 + Math.random() * 0.4)
    const y = lat + size * Math.sin(angle) * (0.8 + Math.random() * 0.4)
    points.push([x, y])
  }
  // 闭合
  points.push(points[0])

  return {
    type: 'Feature',
    properties: { name },
    geometry: {
      type: 'Polygon',
      coordinates: [points]
    }
  }
}
