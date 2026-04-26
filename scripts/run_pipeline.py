import requests
import pandas as pd
import json
import random
from pathlib import Path
from datetime import datetime, timedelta
import os

def fetch_products_from_api():
    """Fetch product data from Open Food Facts API with fallback to synthetic data."""
    url = "https://world.openfoodfacts.org/cgi/search.pl?action=process&json=1&tagtype_0=categories&tag_contains_0=contains&tag_0=beverages&page_size=100&fields=product_name,nutriments,categories_tags,brands"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        products = []
        for product in data.get('products', []):
            if product.get('product_name') and product.get('product_name').strip():
                products.append({
                    'product_name': product['product_name'].strip(),
                    'categories': product.get('categories_tags', ['beverages'])[0] if product.get('categories_tags') else 'beverages',
                    'brand': product.get('brands', 'Unknown').strip() or 'Unknown'
                })
        
        if len(products) < 10:
            raise Exception("Not enough valid products from API")
            
        return products
        
    except Exception as e:
        print(f"API call failed: {e}. Using synthetic product data.")
        return generate_synthetic_products()

def generate_synthetic_products():
    """Generate synthetic product data as fallback."""
    product_names = [
        "Cola Classic", "Orange Juice", "Mineral Water", "Green Tea", "Lemonade",
        "Apple Juice", "Sparkling Water", "Energy Drink", "Iced Coffee", "Ginger Ale",
        "Grape Juice", "Coconut Water", "Sports Drink", "Herbal Tea", "Tomato Juice",
        "Pineapple Juice", "Club Soda", "Cherry Soda", "Peach Tea", "Mango Juice",
        "Lime Soda", "Berry Blast", "Vanilla Shake", "Chocolate Milk", "Strawberry Smoothie",
        "Protein Drink", "Vitamin Water", "Kombucha", "Cold Brew", "Lemon Iced Tea",
        "Root Beer", "Grapefruit Soda", "Peach Nectar", "Coconut Milk", "Almond Milk",
        "Energy Shot", "Electrolyte Drink", "Matcha Tea", "Chai Latte", "Mint Tea",
        "Pomegranate Juice", "Cranberry Juice", "Apple Cider", "Hot Chocolate", "Green Smoothie"
    ]
    
    categories = ["beverages", "soft_drinks", "juices", "water", "tea", "energy_drinks", "dairy", "functional"]
    brands = ["BrandA", "BrandB", "BrandC", "BrandD", "BrandE", "PremiumCo", "ValueBrand"]
    
    products = []
    for i, name in enumerate(product_names):
        products.append({
            'product_id': f'PROD_{i+1:03d}',
            'product_name': name,
            'categories': random.choice(categories),
            'brand': random.choice(brands)
        })
    
    return products

def generate_transactions(products):
    """Generate synthetic sales transactions over 365 days."""
    transactions = []
    start_date = datetime.now() - timedelta(days=364)
    
    for day_offset in range(365):
        current_date = start_date + timedelta(days=day_offset)
        
        # Market shock simulation: days 290-310
        if 290 <= day_offset <= 310:
            daily_products = random.randint(1, 4)  # Reduced products during shock
        else:
            daily_products = random.randint(3, 12)
        
        for _ in range(daily_products):
            product = random.choice(products)
            price = round(random.uniform(1.5, 45.0), 2)
            quantity = random.randint(1, 50)
            revenue = price * quantity
            
            transactions.append({
                'transaction_id': f"txn_{day_offset}_{len(transactions)}",
                'date': current_date.strftime('%Y-%m-%d'),
                'product_name': product['product_name'],
                'category': product['categories'],
                'brand': product['brand'],
                'price': price,
                'quantity': quantity,
                'revenue': revenue
            })
    
    return transactions

def clean_data(df):
    """Apply data cleaning rules."""
    # Drop rows where product_name is null or empty
    df = df[df['product_name'].notna() & (df['product_name'].str.strip() != '')]
    
    # Ensure revenue column is float
    df['revenue'] = pd.to_numeric(df['revenue'], errors='coerce')
    df = df[df['revenue'].notna()]
    
    # Normalize dates to YYYY-MM-DD format
    df['date'] = pd.to_datetime(df['date']).dt.strftime('%Y-%m-%d')
    
    # Remove duplicate transaction IDs
    df = df.drop_duplicates(subset=['transaction_id'], keep='first')
    
    return df.reset_index(drop=True)

def calculate_kpis(df):
    """Calculate KPIs."""
    total_revenue = df['revenue'].sum()
    total_transactions = len(df)
    avg_order_value = total_revenue / total_transactions if total_transactions > 0 else 0
    
    # Growth rate: last 30 days vs previous 30 days
    df['date'] = pd.to_datetime(df['date'])
    max_date = df['date'].max()
    last_30_days = max_date - timedelta(days=29)
    prev_30_start = last_30_days - timedelta(days=30)
    prev_30_end = last_30_days - timedelta(days=1)
    
    recent_revenue = df[df['date'] >= last_30_days]['revenue'].sum()
    prev_revenue = df[(df['date'] >= prev_30_start) & (df['date'] <= prev_30_end)]['revenue'].sum()
    
    growth_rate = ((recent_revenue - prev_revenue) / prev_revenue * 100) if prev_revenue > 0 else 0
    
    # Top category
    top_category = df.groupby('category')['revenue'].sum().idxmax()
    
    return {
        "total_revenue": round(total_revenue, 2),
        "avg_order_value": round(avg_order_value, 2),
        "growth_rate": round(growth_rate, 2),
        "total_transactions": total_transactions,
        "top_category": top_category,
        "generated_at": datetime.now().isoformat()
    }

def calculate_trends(df):
    """Calculate daily trends."""
    df['date'] = pd.to_datetime(df['date'])
    daily = df.groupby('date').agg({
        'revenue': 'sum',
        'transaction_id': 'count'
    }).rename(columns={'transaction_id': 'transactions'})
    
    daily['avg_order_value'] = daily['revenue'] / daily['transactions']
    daily = daily.reset_index()
    daily['date'] = daily['date'].dt.strftime('%Y-%m-%d')
    
    # Convert to list of dicts
    trends = []
    for _, row in daily.iterrows():
        trends.append({
            "date": row['date'],
            "revenue": round(float(row['revenue']), 2),
            "transactions": int(row['transactions']),
            "avg_order_value": round(float(row['avg_order_value']), 2)
        })
    
    return trends

def detect_insights(df):
    """Detect insights based on business rules."""
    insights = []
    df['date'] = pd.to_datetime(df['date'])
    daily = df.groupby('date').agg({'revenue': 'sum'}).reset_index()
    daily = daily.sort_values('date')
    
    # Rule 1: Revenue drop - 7-day rolling average drops >15%
    daily['revenue_7d_avg'] = daily['revenue'].rolling(window=7).mean()
    daily['revenue_7d_prev'] = daily['revenue_7d_avg'].shift(7)
    daily['revenue_drop_pct'] = ((daily['revenue_7d_prev'] - daily['revenue_7d_avg']) / daily['revenue_7d_prev'] * 100)
    
    significant_drops = daily[daily['revenue_drop_pct'] > 15]
    for _, row in significant_drops.iterrows():
        if pd.notna(row['revenue_drop_pct']):
            end_date = row['date'].strftime('%Y-%m-%d')
            start_date = (row['date'] - timedelta(days=6)).strftime('%Y-%m-%d')
            insights.append({
                "id": f"revenue_drop_{row['date'].strftime('%Y%m%d')}",
                "type": "alert",
                "severity": "high",
                "message": f"Revenue dropped {row['revenue_drop_pct']:.1f}% vs previous week",
                "detail": f"7-day average revenue significantly declined compared to previous 7 days",
                "affected_period": f"{start_date} / {end_date}",
                "metric": "revenue"
            })
    
    # Rule 2: Revenue spike - 7-day rolling average rises >20%
    significant_spikes = daily[daily['revenue_drop_pct'] < -20]
    for _, row in significant_spikes.iterrows():
        if pd.notna(row['revenue_drop_pct']):
            end_date = row['date'].strftime('%Y-%m-%d')
            start_date = (row['date'] - timedelta(days=6)).strftime('%Y-%m-%d')
            insights.append({
                "id": f"revenue_spike_{row['date'].strftime('%Y%m%d')}",
                "type": "alert",
                "severity": "medium",
                "message": f"Revenue spiked {abs(row['revenue_drop_pct']):.1f}% vs previous week",
                "detail": f"7-day average revenue significantly increased compared to previous 7 days",
                "affected_period": f"{start_date} / {end_date}",
                "metric": "revenue"
            })
    
    # Rule 3: Top product change vs previous 30 days
    max_date = df['date'].max()
    last_30_days = max_date - timedelta(days=29)
    prev_30_start = last_30_days - timedelta(days=30)
    prev_30_end = last_30_days - timedelta(days=1)
    
    recent_top = df[df['date'] >= last_30_days].groupby('product_name')['revenue'].sum().idxmax()
    prev_top = df[(df['date'] >= prev_30_start) & (df['date'] <= prev_30_end)].groupby('product_name')['revenue'].sum().idxmax()
    
    if recent_top != prev_top:
        insights.append({
            "id": f"top_product_change_{datetime.now().strftime('%Y%m%d')}",
            "type": "info",
            "severity": "low",
            "message": f"Top product changed from {prev_top} to {recent_top}",
            "detail": f"Revenue leadership shifted between products in recent 30-day period",
            "affected_period": f"{prev_30_start.strftime('%Y-%m-%d')} / {max_date.strftime('%Y-%m-%d')}",
            "metric": "revenue"
        })
    
    # Rule 4: Sustained decline - 3 consecutive weeks of declining weekly revenue
    daily['week'] = df['date'].dt.isocalendar().week
    daily['year'] = df['date'].dt.isocalendar().year
    weekly = daily.groupby(['year', 'week'])['revenue'].sum().reset_index()
    weekly['revenue_change'] = weekly['revenue'].diff()
    
    decline_count = 0
    for i in range(1, len(weekly)):
        if weekly.iloc[i]['revenue_change'] < 0:
            decline_count += 1
            if decline_count >= 3:
                start_week = weekly.iloc[i-2]['week']
                end_week = weekly.iloc[i]['week']
                year = weekly.iloc[i]['year']
                insights.append({
                    "id": f"sustained_decline_{year}_{int(end_week)}",
                    "type": "alert",
                    "severity": "high",
                    "message": "3 consecutive weeks of declining revenue",
                    "detail": f"Weekly revenue has declined for 3 straight weeks indicating sustained downturn",
                    "affected_period": f"{year}-W{int(start_week):02d} / {year}-W{int(end_week):02d}",
                    "metric": "revenue"
                })
                break
        else:
            decline_count = 0
    
    return insights

def validate_json_file(file_path, expected_type):
    """Validate JSON file structure after writing."""
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        if expected_type == 'kpis':
            required_fields = ['total_revenue', 'avg_order_value', 'growth_rate', 'total_transactions', 'top_category', 'generated_at']
            for field in required_fields:
                if field not in data:
                    raise ValueError(f"Missing field: {field}")
        
        elif expected_type == 'trends':
            if not isinstance(data, list):
                raise ValueError("Trends should be a list")
            for item in data:
                required_fields = ['date', 'revenue', 'transactions', 'avg_order_value']
                for field in required_fields:
                    if field not in item:
                        raise ValueError(f"Missing field in trend item: {field}")
        
        elif expected_type == 'insights':
            if not isinstance(data, list):
                raise ValueError("Insights should be a list")
            for item in data:
                required_fields = ['id', 'type', 'severity', 'message', 'detail', 'affected_period', 'metric']
                for field in required_fields:
                    if field not in item:
                        raise ValueError(f"Missing field in insight item: {field}")
        
        elif expected_type == 'product_metrics':
            if not isinstance(data, list):
                raise ValueError("Product metrics should be a list")
            for item in data:
                required_fields = ['product_id', 'product_name', 'category', 'current_price', 'avg_daily_units', 'revenue', 'price_volatility', 'demand_trend', 'elasticity']
                for field in required_fields:
                    if field not in item:
                        raise ValueError(f"Missing field in product metrics item: {field}")
        
        elif expected_type == 'recommendations':
            if not isinstance(data, list):
                raise ValueError("Recommendations should be a list")
            for item in data:
                required_fields = ['product_id', 'product_name', 'current_price', 'recommended_price', 'expected_revenue_change', 'confidence', 'reason', 'action']
                for field in required_fields:
                    if field not in item:
                        raise ValueError(f"Missing field in recommendation item: {field}")
        
        return True
    except Exception as e:
        print(f"Validation failed for {file_path}: {e}")
        return False

def print_file_summary(file_path, record_count):
    """Print file summary to stdout."""
    file_size = os.path.getsize(file_path) / 1024  # KB
    print(f"✓ {file_path} - {record_count} records - {file_size:.1f} KB")

def calculate_price_elasticity(base_units, base_price, perturbed_units, perturbed_price):
    """Calculate price elasticity: (% change in quantity) / (% change in price)"""
    if base_price == 0 or perturbed_price == 0:
        return -0.5  # Default to normal elasticity
    
    quantity_change_pct = ((perturbed_units - base_units) / base_units) * 100
    price_change_pct = ((perturbed_price - base_price) / base_price) * 100
    
    if price_change_pct == 0:
        return -0.5
    
    elasticity = quantity_change_pct / price_change_pct
    return elasticity

def simulate_demand_change(units, price_change_pct, elasticity):
    """Simulate demand change based on price change and elasticity"""
    # Simplified demand model: quantity_change = elasticity * price_change_pct / 100
    quantity_change_pct = elasticity * price_change_pct
    new_units = units * (1 + quantity_change_pct / 100)
    return max(0, new_units)  # Ensure non-negative

def generate_product_metrics(products, df):
    """Generate product-level metrics with price elasticity analysis."""
    product_metrics = []
    
    # Calculate total revenue for Pareto distribution
    total_revenue = df['revenue'].sum()
    
    for product in products:
        # Filter transactions for this product
        product_df = df[df['product_name'] == product['product_name']]
        
        if len(product_df) == 0:
            # Fallback: generate synthetic metrics
            avg_daily_units = random.uniform(5, 100)
            current_price = random.uniform(2.0, 25.0)
            revenue = avg_daily_units * current_price * 365
        else:
            # Calculate from actual data
            total_units = product_df['quantity'].sum()
            avg_daily_units = total_units / 365
            current_price = product_df['price'].mean()
            revenue = product_df['revenue'].sum()
        
        # Apply Pareto distribution (top 20% get ~60% of revenue)
        pareto_factor = 1.0
        if random.random() < 0.2:  # Top 20%
            pareto_factor = random.uniform(2.5, 4.0)
        else:  # Bottom 80%
            pareto_factor = random.uniform(0.3, 0.8)
        
        revenue *= pareto_factor
        
        # Calculate price volatility (synthetic)
        price_volatility = random.uniform(0.05, 0.25)
        
        # Determine demand trend based on recent performance
        if len(product_df) > 0:
            recent_half = product_df.tail(len(product_df)//2)
            early_half = product_df.head(len(product_df)//2)
            
            recent_avg = recent_half['quantity'].mean() if len(recent_half) > 0 else 0
            early_avg = early_half['quantity'].mean() if len(early_half) > 0 else 0
            
            if recent_avg > early_avg * 1.1:
                demand_trend = "up"
            elif recent_avg < early_avg * 0.9:
                demand_trend = "down"
            else:
                demand_trend = "stable"
        else:
            demand_trend = random.choice(["up", "down", "stable"])
        
        # Simulate price elasticity through perturbations
        price_perturbation = random.uniform(0.05, 0.15)  # 5-15% perturbation
        perturbed_price = current_price * (1 + price_perturbation)
        
        # Simulate demand response (simplified model)
        base_elasticity = random.uniform(-2.0, -0.1)  # Most products are elastic
        perturbed_units = simulate_demand_change(avg_daily_units, price_perturbation * 100, base_elasticity)
        
        elasticity = calculate_price_elasticity(avg_daily_units, current_price, perturbed_units, perturbed_price)
        
        # Categorize elasticity
        if elasticity < -1:
            elasticity_category = "elastic"
        elif -1 <= elasticity <= -0.3:
            elasticity_category = "normal"
        else:
            elasticity_category = "inelastic"
        
        product_metrics.append({
            "product_id": product['product_id'],
            "product_name": product['product_name'],
            "category": product['categories'],
            "current_price": round(current_price, 2),
            "avg_daily_units": round(avg_daily_units, 2),
            "revenue": round(revenue, 2),
            "price_volatility": round(price_volatility, 4),
            "demand_trend": demand_trend,
            "elasticity": round(elasticity, 4),
            "elasticity_category": elasticity_category
        })
    
    # Sort by revenue (Pareto principle)
    product_metrics.sort(key=lambda x: x['revenue'], reverse=True)
    return product_metrics

def generate_pricing_recommendations(product_metrics):
    """Generate actionable pricing recommendations."""
    recommendations = []
    
    for product in product_metrics:
        current_price = product['current_price']
        elasticity = product['elasticity']
        avg_daily_units = product['avg_daily_units']
        
        # Simulate three scenarios
        scenarios = [
            {"name": "decrease_10", "price_change": -0.10},
            {"name": "no_change", "price_change": 0.0},
            {"name": "increase_10", "price_change": 0.10}
        ]
        
        best_scenario = None
        best_revenue_change = 0
        
        for scenario in scenarios:
            new_price = current_price * (1 + scenario['price_change'])
            new_units = simulate_demand_change(avg_daily_units, scenario['price_change'] * 100, elasticity)
            new_revenue = new_price * new_units * 365
            current_revenue = current_price * avg_daily_units * 365
            revenue_change = ((new_revenue - current_revenue) / current_revenue) * 100
            
            if revenue_change > best_revenue_change:
                best_revenue_change = revenue_change
                best_scenario = {
                    "scenario": scenario['name'],
                    "new_price": new_price,
                    "new_units": new_units,
                    "revenue_change": revenue_change
                }
        
        # Determine action and confidence
        if best_revenue_change > 10:
            confidence = "high"
        elif best_revenue_change > 5:
            confidence = "medium"
        elif best_revenue_change > 3:
            confidence = "low"
        else:
            confidence = "low"
        
        # Determine action
        if abs(best_revenue_change) < 3:
            action = "keep_price"
            reason = "Minimal revenue impact from price changes"
        elif best_scenario['scenario'] == "decrease_10":
            action = "decrease_price"
            reason = "Price decrease drives significant volume increase"
        elif best_scenario['scenario'] == "increase_10":
            action = "increase_price"
            reason = "Price increase maximizes revenue with minimal volume loss"
        else:
            action = "keep_price"
            reason = "Current pricing is optimal"
        
        # Only include actionable recommendations
        if action != "keep_price" or abs(best_revenue_change) > 5:
            recommendations.append({
                "product_id": product['product_id'],
                "product_name": product['product_name'],
                "current_price": product['current_price'],
                "recommended_price": round(best_scenario['new_price'], 2),
                "expected_revenue_change": round(best_revenue_change, 2),
                "confidence": confidence,
                "reason": reason[:120],  # Max 120 chars
                "action": action,
                "elasticity": product['elasticity'],
                "current_revenue": product['revenue']
            })
    
    # Sort by expected revenue change
    recommendations.sort(key=lambda x: x['expected_revenue_change'], reverse=True)
    return recommendations

def enhance_insights_with_pricing(product_metrics, recommendations, existing_insights):
    """Enhance insights with pricing-specific opportunities and risks."""
    pricing_insights = []
    
    # Add pricing opportunity insights
    top_increase = [r for r in recommendations if r['action'] == 'increase_price'][:3]
    for rec in top_increase:
        pricing_insights.append({
            "id": f"pricing_opportunity_increase_{rec['product_id']}",
            "type": "pricing_opportunity",
            "severity": "medium",
            "message": f"Price {rec['product_name']} up by {((rec['recommended_price']/rec['current_price'])-1)*100:.1f}%",
            "detail": f"Expected revenue increase: {rec['expected_revenue_change']:.1f}% with {rec['confidence']} confidence",
            "affected_period": f"Next quarter",
            "metric": "revenue"
        })
    
    top_decrease = [r for r in recommendations if r['action'] == 'decrease_price'][:3]
    for rec in top_decrease:
        pricing_insights.append({
            "id": f"pricing_opportunity_decrease_{rec['product_id']}",
            "type": "pricing_opportunity", 
            "severity": "medium",
            "message": f"Reduce {rec['product_name']} price to boost volume",
            "detail": f"Elastic demand suggests {rec['expected_revenue_change']:.1f}% revenue potential",
            "affected_period": f"Next quarter",
            "metric": "revenue"
        })
    
    # Add risk insights for declining products
    declining_products = [p for p in product_metrics if p['demand_trend'] == 'down' and p['revenue'] > 10000][:5]
    for product in declining_products:
        pricing_insights.append({
            "id": f"pricing_risk_decline_{product['product_id']}",
            "type": "risk",
            "severity": "high" if product['revenue'] > 50000 else "medium",
            "message": f"Declining demand on {product['product_name']}",
            "detail": f"Revenue at risk: {product['revenue']:.0f} with downward trend",
            "affected_period": f"Last 90 days",
            "metric": "volume"
        })
    
    # Add elasticity insights
    very_elastic = [p for p in product_metrics if p['elasticity'] < -1.5 and p['revenue'] > 20000][:3]
    for product in very_elastic:
        pricing_insights.append({
            "id": f"pricing_elasticity_{product['product_id']}",
            "type": "pricing_opportunity",
            "severity": "low",
            "message": f"{product['product_name']} highly price sensitive",
            "detail": f"Elasticity: {product['elasticity']:.2f} - consider promotional pricing",
            "affected_period": f"Ongoing",
            "metric": "revenue"
        })
    
    # Combine with existing insights
    all_insights = existing_insights + pricing_insights
    
    # Limit to top 50 insights by severity
    severity_order = {"high": 3, "medium": 2, "low": 1}
    all_insights.sort(key=lambda x: (severity_order.get(x['severity'], 0), x['type']), reverse=True)
    
    return all_insights[:50]

def main():
    print("Starting Pricing Strategy Engine...")
    
    # Step 1: Fetch products
    print("Fetching product data...")
    products = fetch_products_from_api()
    
    # Save raw products data
    raw_file = Path("data/raw/raw_products.json")
    with open(raw_file, 'w') as f:
        json.dump(products, f, indent=2)
    print_file_summary(str(raw_file), len(products))
    
    # Step 2: Generate transactions
    print("Generating transactions...")
    transactions = generate_transactions(products)
    
    # Step 3: Clean data
    print("Cleaning data...")
    df = pd.DataFrame(transactions)
    df = clean_data(df)
    
    # Step 4: Calculate KPIs
    print("Calculating KPIs...")
    kpis = calculate_kpis(df)
    
    kpis_file = Path("data/processed/kpis.json")
    with open(kpis_file, 'w') as f:
        json.dump(kpis, f, indent=2)
    
    if validate_json_file(kpis_file, 'kpis'):
        print_file_summary(str(kpis_file), 1)
    
    # Step 5: Calculate trends
    print("Calculating trends...")
    trends = calculate_trends(df)
    
    trends_file = Path("data/processed/trends.json")
    with open(trends_file, 'w') as f:
        json.dump(trends, f, indent=2)
    
    if validate_json_file(trends_file, 'trends'):
        print_file_summary(str(trends_file), len(trends))
    
    # Step 6: Generate product metrics
    print("Generating product metrics...")
    product_metrics = generate_product_metrics(products, df)
    
    product_metrics_file = Path("data/processed/product_metrics.json")
    with open(product_metrics_file, 'w') as f:
        json.dump(product_metrics, f, indent=2)
    
    if validate_json_file(product_metrics_file, 'product_metrics'):
        print_file_summary(str(product_metrics_file), len(product_metrics))
    
    # Step 7: Generate pricing recommendations
    print("Generating pricing recommendations...")
    recommendations = generate_pricing_recommendations(product_metrics)
    
    recommendations_file = Path("data/processed/recommendations.json")
    with open(recommendations_file, 'w') as f:
        json.dump(recommendations, f, indent=2)
    
    if validate_json_file(recommendations_file, 'recommendations'):
        print_file_summary(str(recommendations_file), len(recommendations))
    
    # Step 8: Detect insights and enhance with pricing
    print("Detecting insights...")
    base_insights = detect_insights(df)
    enhanced_insights = enhance_insights_with_pricing(product_metrics, recommendations, base_insights)
    
    insights_file = Path("data/processed/insights.json")
    with open(insights_file, 'w') as f:
        json.dump(enhanced_insights, f, indent=2)
    
    if validate_json_file(insights_file, 'insights'):
        print_file_summary(str(insights_file), len(enhanced_insights))
    
    print("Pricing Strategy Engine completed successfully!")
    print(f"Generated {len(recommendations)} actionable pricing recommendations")
    print(f"Products analyzed: {len(product_metrics)}")
    actionable_pct = (len([r for r in recommendations if r['action'] != 'keep_price']) / len(product_metrics)) * 100
    print(f"Actionable recommendations: {actionable_pct:.1f}% of products")

if __name__ == "__main__":
    main()
